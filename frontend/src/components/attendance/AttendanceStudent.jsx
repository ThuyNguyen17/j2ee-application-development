import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordAttendance } from '../../api/attendanceApi';
import './AttendanceStudent.css';

const AttendanceStudent = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('sessionId');
    const token = queryParams.get('token');

    const [name, setName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [geoLoc, setGeoLoc] = useState('');
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const getLocation = () => {
        if (!window.isSecureContext) {
            setGeoLoc("Lỗi: Cần HTTPS để lấy vị trí trên điện thoại.");
            return;
        }

        if (navigator.geolocation) {
            setGeoLoc("Đang xác định vị trí...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeoLoc(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
                },
                (error) => {
                    console.error("Error getting location", error);
                    let msg = "Lỗi định vị";
                    if (error.code === 1) msg = "Bị chặn (Hãy cho phép trong cài đặt)";
                    else if (error.code === 3) msg = "Hết thời gian (Timeout)";
                    setGeoLoc(msg);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setGeoLoc("Trình duyệt không hỗ trợ");
        }
    };

    const useMockLocation = () => {
        setGeoLoc("21.028511, 105.804817"); // Tọa độ mặc định (Hà Nội)
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !studentClass) {
            alert("Vui lòng nhập tên và lớp");
            return;
        }

        setStatus('submitting');
        try {
            await recordAttendance({
                sessionId,
                qrToken: token,
                studentName: name,
                studentClass: studentClass,
                location: geoLoc,
                note: ""
            });
            setStatus('success');
        } catch (err) {
            console.error(err);
            const serverMsg = err.response?.data?.message || "Lỗi kết nối server hoặc mã QR hết hạn";
            alert("Lỗi: " + serverMsg);
            setStatus('error');
        }
    };

    if (!sessionId || sessionId === 'null' || sessionId === 'undefined' || !token || token === 'null' || token === 'undefined') {
        return (
            <div className="student-container">
                <h2 style={{ color: '#ef4444' }}>Mã QR không hợp lệ</h2>
                <p className="error-info">Thiếu thông tin phiên học hoặc token xác thực. Vui lòng quét lại mã mới nhất từ giáo viên.</p>
            </div>
        );
    }

    if (status === 'success') {
        return <div className="student-container success"><h2>Điểm danh thành công!</h2></div>;
    }

    return (
        <div className="student-container">
            <h2>Điểm Danh</h2>
            <form onSubmit={handleSubmit} className="student-form">
                <div className="form-group">
                    <label>Họ và Tên:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên của bạn"
                    />
                </div>
                <div className="form-group">
                    <label>Lớp:</label>
                    <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        placeholder="Nhập lớp (VD: 12A1)"
                    />
                </div>
                <div className="form-group">
                    <label>Vị trí:</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" value={geoLoc} readOnly className="readonly-input" style={{ flex: 1 }} />
                            <button
                                type="button"
                                onClick={getLocation}
                                style={{ width: 'auto', padding: '0 10px', fontSize: '0.8em', background: '#666' }}
                            >
                                Thử lại
                            </button>
                        </div>
                        {(geoLoc.includes("Lỗi") || geoLoc.includes("chặn")) && (
                            <button
                                type="button"
                                onClick={useMockLocation}
                                style={{ fontSize: '0.8em', background: '#3498db', padding: '5px' }}
                            >
                                Dùng vị trí giả lập (Để Demo)
                            </button>
                        )}
                    </div>
                </div>

                {status === 'error' && <p className="error-msg">Lỗi điểm danh! Hãy kiểm tra lại kết nối hoặc quét lại mã mới.</p>}

                <button type="submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Đang gửi...' : 'Xác nhận Điểm danh'}
                </button>

                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                    * Vui lòng bật GPS và gửi trong vòng 1 phút kể từ khi quét mã. <br />
                    * Nếu không lấy được vị trí, hãy thử dùng trình duyệt Chrome/Safari.
                </p>
            </form>
        </div>
    );
};

export default AttendanceStudent;
