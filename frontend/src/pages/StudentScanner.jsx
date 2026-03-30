





import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { recordAttendance } from '../api/attendanceApi';
import { ArrowLeft, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { normalizeClassName } from '../utils/classNameUtils';
import './StudentScanner.css';

const StudentScanner = () => {
    const [student, setStudent] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, recording, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [location, setLocation] = useState('');
    const scannerRef = useRef(null);
    const studentRef = useRef(null);
    const locationRef = useRef('Đang lấy vị trí...');
    const coordsRef = useRef(null);
    const navigate = useNavigate();

    const isInvalidLocation = (loc) => {
        if (!loc) return true;
        const s = String(loc).trim();
        if (!s) return true;
        const lower = s.toLowerCase();
        if (lower.includes('không thể lấy vị trí')) return true;
        if (lower.includes('khong the lay vi tri')) return true;
        if (lower.includes('từ chối')) return true;
        if (lower.includes('tu choi')) return true;
        if (lower.includes('đang lấy vị trí')) return true;
        if (lower.includes('dang lay vi tri')) return true;
        if (lower.includes('denied')) return true;
        return false;
    };

    const reverseGeocodeViaBackend = async (lat, lon) => {
        const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);
        const data = await res.json();
        return data?.address || '';
    };

    const ensureLocation = async () => {
        if (!isInvalidLocation(locationRef.current) && coordsRef.current) return;

        if (!navigator.geolocation) {
            const errStr = 'Không thể lấy vị trí (Thiết bị không hỗ trợ GPS)';
            setLocation(errStr);
            locationRef.current = errStr;
            throw new Error(errStr);
        }

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
    };

    useEffect(() => {
        let s = null;
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/student/login');
                return;
            }
            s = JSON.parse(storedUser);
            if (!s) {
                navigate('/student/login');
                return;
            }
            if (s.role === 'TEACHER') {
                navigate('/teacher/timetable');
                return;
            }
            if (s.role !== 'STUDENT') {
                navigate('/student/login');
                return;
            }
            const normalized = { ...s, className: normalizeClassName(s.className) };
            setStudent(normalized);
            studentRef.current = normalized;
        } catch (e) {
            navigate('/student/login');
            return;
        }

 // Preload location early so it is ready when scanning succeeds.
        ensureLocation().catch(() => {});








        const queryParams = new URLSearchParams(window.location.search);
        const qSessionId = queryParams.get('sessionId');
        const qToken = queryParams.get('token');

        if (qSessionId && qToken) {
            handleRecordAttendance(qSessionId, qToken, s);
        }
    }, [navigate]);

    useEffect(() => {
        if (status === 'idle') {
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                onScanSuccess
            ).catch(err => {
                console.error("Scanner fail", err);
                html5QrCode.start({ facingMode: "user" }, config, onScanSuccess);
            });

            return () => {
                if (html5QrCode.isScanning) {
                    html5QrCode.stop().catch(e => console.error(e));
                }
            };
        }
    }, [status]);

    const onScanSuccess = async (decodedText) => {
        try {
            const url = new URL(decodedText);
            const sessionId = url.searchParams.get('sessionId');
            const token = url.searchParams.get('token');

            if (sessionId && token) {
                if (scannerRef.current && scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                handleRecordAttendance(sessionId, token);
            }
        } catch (e) {
            console.error("Scan error", e);
        }
    };

    
    const handleRecordAttendance = async (sessionId, token, directStudent = null) => {
        const studentData = directStudent || studentRef.current || student;
        if (!studentData) {
            setErrorMsg("Hệ thống chưa nhận diện được sinh viên. Hãy đăng nhập lại.");
            setStatus('error');
            return;
        }

        setStatus('recording');
        

        try {
            await ensureLocation();
            await recordAttendance({
                sessionId,
                qrToken: token,
                studentId: studentData.studentId,
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

    return (
        <div className="scanner-page">
            <header className="scanner-header">
                <button onClick={() => navigate('/student/dashboard')} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Quét Mã Điểm Danh</h2>
            </header>

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
                        <button onClick={() => setStatus('idle')} className="primary-btn">Quét Lại</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentScanner;
