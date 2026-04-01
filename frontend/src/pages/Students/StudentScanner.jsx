import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { recordAttendance } from '../../api/attendanceApi';
import { BASE_URL } from '../../api/config';
import { ArrowLeft, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { normalizeClassName } from '../../utils/classNameUtils';
import './StudentScanner.css';

const fetchStudentByUserId = async (userId) => {
    const res = await fetch(`${BASE_URL}/api/students/by-user/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
    return res.json();
};

const StudentScanner = () => {
    const [student, setStudent] = useState(null);
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [location, setLocation] = useState('');
    const scannerRef = useRef(null);
    const studentRef = useRef(null);
    const locationRef = useRef('Đang lấy vị trí...');
    const coordsRef = useRef(null);
    const scannerStartedRef = useRef(false);
    const navigate = useNavigate();

    const isInvalidLocation = (loc) => {
        if (!loc) return true;
        const s = String(loc).trim();
        if (!s) return true;
        const lower = s.toLowerCase();
        return [
            'không thể lấy vị trí',
            'khong the lay vi tri',
            'từ chối',
            'tu choi',
            'đang lấy vị trí',
            'dang lay vi tri',
            'denied'
        ].some(sub => lower.includes(sub));
    };

    const reverseGeocodeViaBackend = async (lat, lon) => {
        const res = await fetch(`${BASE_URL}/api/geocode/reverse?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);
        const data = await res.json();
        return data?.address || '';
    };

    const ensureLocation = async () => {
        // Nếu đã có location hợp lệ, không cần lấy lại
        if (!isInvalidLocation(locationRef.current) && coordsRef.current) return;

        // Nếu thiết bị không hỗ trợ geolocation, dùng fallback
        if (!navigator.geolocation) {
            const fallbackLoc = 'Không thể lấy vị trí (Thiết bị không hỗ trợ GPS)';
            setLocation(fallbackLoc);
            locationRef.current = fallbackLoc;
            return; // Không throw error, vẫn cho phép điểm danh
        }

        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 0
                });
            });

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            coordsRef.current = { lat, lon };

            let address = '';
            try {
                address = await reverseGeocodeViaBackend(lat, lon);
            } catch {
                address = '';
            }

            const coordStr = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            const finalLoc = address ? `${address} (${coordStr})` : coordStr;
            setLocation(finalLoc);
            locationRef.current = finalLoc;
        } catch (err) {
            // Fallback khi geolocation fail - dùng empty string để không hiển thị lỗi
            locationRef.current = '';
            console.warn('Geolocation failed:', err);
        }
    };

    // -------------------------
    // Load student info & auto record if URL has sessionId/token
    // -------------------------
    useEffect(() => {
        let s = null;
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/login');
                return;
            }
            s = JSON.parse(storedUser);
            if (!s) {
                navigate('/login');
                return;
            }
            if (s.role === 'TEACHER') {
                navigate('/teacher/timetable');
                return;
            }
            if (s.role !== 'STUDENT') {
                navigate('/login');
                return;
            }
            const normalized = { ...s, className: normalizeClassName(s.className) };
            setStudent(normalized);
            studentRef.current = normalized;

            // Lấy studentId đầy đủ từ API nếu chỉ có userId
            if (s.userId && !s.studentId) {
                fetchStudentByUserId(s.userId).then(fullStudent => {
                    if (fullStudent && fullStudent.id) {
                        const updated = { ...normalized, studentId: fullStudent.id };
                        setStudent(updated);
                        studentRef.current = updated;
                    }
                }).catch(err => console.error('Failed to fetch student:', err));
            }
        } catch (e) {
            navigate('/login');
            return;
        }

        // Preload location early
        ensureLocation().catch(() => {});

        // Auto record from URL params
        const queryParams = new URLSearchParams(window.location.search);
        const qSessionId = queryParams.get('sessionId');
        const qToken = queryParams.get('token');

        if (qSessionId && qToken) {
            handleRecordAttendance(qSessionId, qToken, s);
        }
    }, [navigate]);

    // -------------------------
    // Start scanner once
    // -------------------------
    useEffect(() => {
        if (scannerStartedRef.current) return;

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            onScanSuccess
        ).catch(err => {
            console.error("Scanner fail", err);
            // Try front camera as fallback
            html5QrCode.start({ facingMode: "user" }, config, onScanSuccess)
                .catch(subErr => {
                    console.error("Second scanner fail", subErr);
                    let msg = "Không thể truy cập camera. ";
                    if (subErr?.name === 'NotAllowedError' || subErr?.toString().includes('Permission denied')) {
                        msg += "Bạn đã từ chối quyền truy cập camera. Vui lòng vào BIỂU TƯỢNG CAMERA trên thanh địa chỉ trình duyệt để CHO PHÉP (Allow) và tải lại trang.";
                    } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                        msg += "Trình duyệt chỉ cho phép truy cập camera qua kết nối HTTPS bảo mật (hoặc localhost).";
                    } else {
                        msg += "Lỗi: " + (subErr?.message || subErr?.toString());
                    }
                    setErrorMsg(msg);
                    setStatus('error');
                });
        });

        scannerStartedRef.current = true;

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().catch(e => console.error(e));
            }
        };
    }, []);

    // -------------------------
    // Scan callback
    // -------------------------
    const onScanSuccess = async (decodedText) => {
        try {
            const url = new URL(decodedText);
            const sessionId = url.searchParams.get('sessionId');
            const token = url.searchParams.get('token');

            if (sessionId && token) {
                if (scannerRef.current && scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                    scannerStartedRef.current = false;
                }
                handleRecordAttendance(sessionId, token);
            }
        } catch (e) {
            console.error("Scan error", e);
        }
    };

    // -------------------------
    // Record attendance
    // -------------------------
    const handleRecordAttendance = async (sessionId, token, directStudent = null) => {
        let studentData = directStudent || studentRef.current || student;
        if (!studentData) {
            setErrorMsg("Hệ thống chưa nhận diện được sinh viên. Hãy đăng nhập lại.");
            setStatus('error');
            return;
        }

        // Nếu chưa có studentId nhưng có userId, fetch student trước
        let actualStudentId = studentData.studentId;
        if (!actualStudentId && studentData.userId) {
            try {
                const fullStudent = await fetchStudentByUserId(studentData.userId);
                if (fullStudent && fullStudent.id) {
                    actualStudentId = fullStudent.id;
                    // Cập nhật lại studentRef để lần sau dùng
                    const updated = { ...studentData, studentId: fullStudent.id };
                    setStudent(updated);
                    studentRef.current = updated;
                    studentData = updated;
                }
            } catch (err) {
                console.error('Failed to fetch student:', err);
            }
        }

        if (!actualStudentId) {
            setErrorMsg("Không xác định được mã sinh viên. Hãy đăng nhập lại.");
            setStatus('error');
            return;
        }

        setStatus('recording');

        try {
            // Thử lấy location nhưng không bắt buộc
            await ensureLocation().catch(() => {});
            
            // Nếu vẫn không có location, dùng fallback
            if (isInvalidLocation(locationRef.current)) {
                locationRef.current = 'Không xác định được vị trí';
            }
            
            await recordAttendance({
                sessionId,
                qrToken: token,
                studentId: actualStudentId,
                studentName: studentData.fullName,
                studentClass: studentData.className,
                location: locationRef.current,
                note: ""
            });
            setStatus('success');
            if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Lỗi điểm danh. Hãy thử lại.");
            setStatus('error');
        }
    };

    // -------------------------
    // Reset scanner after error
    // -------------------------
    const resetScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop().catch(e => console.error(e));
        }
        scannerStartedRef.current = false;
        setStatus('idle');
    };

    // -------------------------
    // Render
    // -------------------------
    return (
        <div className="scanner-page">
            {/* <header className="scanner-header">
                <button onClick={() => navigate('/student/dashboard')} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Quét Mã Điểm Danh</h2>
            </header> */}

            <main className="scanner-main">
                {status === 'idle' && (
                    <div className="scanner-container">
                        <div id="reader"></div>
                        <div className="location-info">
                            <MapPin size={16} />
                            <span>Địa chỉ: {location || 'Đang xác định...'}</span>
                        </div>
                    </div>
                )}

                {status === 'recording' && (
                    <div className="status-container">
                        <div className="spinner"></div>
                        <p>Đang ghi nhận dữ liệu...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="status-container success">
                        <CheckCircle size={64} color="#16a34a" />
                        <h2>Thành Công!</h2>
                        <p>Bạn đã điểm danh thành công.</p>
                        <div className="success-actions">
                            <button onClick={() => navigate('/student/history')} className="primary-btn">Xem Lịch Sử</button>
                            <button onClick={() => navigate('/student/dashboard')} className="secondary-btn">Về Trang Chủ</button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="status-container error">
                        <AlertCircle size={64} color="#ef4444" />
                        <h2>Lỗi!</h2>
                        <p>{errorMsg}</p>
                        <button onClick={resetScanner} className="primary-btn">Quét Lại</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentScanner;