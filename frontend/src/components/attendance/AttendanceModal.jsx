
import React, { useEffect, useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { startSession, updateQrToken, getAttendances, closeSession, updateAttendanceNote, clearAttendances } from '../../api/attendanceApi';
import { getStudentsByClass } from '../../api/studentApi';
import { normalizeClassName } from '../../utils/classNameUtils';
import './AttendanceModal.css';

const AttendanceModal = ({ isOpen, onClose, assignmentId, date, period, semester, className }) => {
    // Fallback for testing when assignmentId is missing
    const effectiveAssignmentId = assignmentId || "ASS001";
    const [sessionId, setSessionId] = useState(null);
    const [currentQrToken, setCurrentQrToken] = useState('');
    const [attendances, setAttendances] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('attended');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const initSession = async () => {
            try {
                setLoading(true);
                const session = await startSession(effectiveAssignmentId, date, period, semester);
                setSessionId(session.id);
                await updateToken(session.id);
            } catch (error) {
                console.error("Failed to start session", error);
                alert("Failed to create attendance session.");
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId && date && period) {
            initSession();
        }
    }, [isOpen, assignmentId, date, period]);

    const updateToken = async (sId) => {
        if (!sId) return;
        const timestamp = new Date().getTime();
        const newToken = `${sId}-${timestamp}-${Math.random().toString(36).substring(7)}`;

        try {
            await updateQrToken(sId, newToken);
            setCurrentQrToken(newToken); // Update state AFTER successful backend update
        } catch (err) {
            console.error("Failed to update token", err);
        }
    };

    // 10-second interval for QR refresh
    useEffect(() => {
        if (!sessionId) return;

        const interval = setInterval(() => {
            updateToken(sessionId);
        }, 10000);

        return () => clearInterval(interval);
    }, [sessionId]);

    // 2-second interval for fetching attendees
    useEffect(() => {
        if (!sessionId) return;

        const fetchAttendances = async () => {
            try {
                const data = await getAttendances(sessionId);
                setAttendances(data);
            } catch (err) {
                console.error("Error fetching attendances", err);
            }
        };

        const interval = setInterval(fetchAttendances, 2000);
        return () => clearInterval(interval);
    }, [sessionId]);

    const normalizedClassName = normalizeClassName(className || "");

    // Fetch all students in class
    useEffect(() => {
        if (!isOpen || !normalizedClassName) return;

        const fetchAllStudents = async () => {
            try {
                const students = await getStudentsByClass(normalizedClassName);
                setAllStudents(students);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };

        fetchAllStudents();
    }, [isOpen, normalizedClassName]);

    const handleNoteChange = async (attendanceId, newNote) => {
        try {
            await updateAttendanceNote(attendanceId, newNote);
            setAttendances(prev => prev.map(a => a.id === attendanceId ? { ...a, note: newNote } : a));
        } catch (err) {
            console.error("Failed to update note", err);
        }
    };

    const handleSave = async () => {
        if (sessionId) {
            await closeSession(sessionId);
        }
        onClose();
    };

    // Tự động dùng địa chỉ hiện tại (localhost hoặc ngrok) để điện thoại quét được
    const studentUrl = `${window.location.origin}/attendance?sessionId=${sessionId}&token=${currentQrToken}`;

    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--:--';
        // If it's a full ISO string or similar, take the HH:mm:ss part
        if (typeof timeStr === 'string' && timeStr.includes(':')) {
            const parts = timeStr.split(':');
            if (parts.length >= 3) return timeStr.substring(0, 8); // HH:mm:ss
            return timeStr;
        }
        return timeStr;
    };

    // Get attended and unattended students
    const attendedStudentIds = attendances.map(a => a.studentId);
    const unattendedStudents = allStudents.filter(student => !attendedStudentIds.includes(student.studentId));

    const renderAttendeeTable = (students, isAttended = true) => {
        if (isAttended) {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Học sinh</th>
                            <th>Thời gian</th>
                            <th>Vị trí</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-state">Chưa có ai điểm danh...</td>
                            </tr>
                        ) : (
                            students.map((a, idx) => {
                                const isSafe = a.location && !a.location.includes("denied") && !a.location.includes("Lỗi") && !a.location.includes("Denied");
                                return (
                                    <tr key={idx} className="attendee-row animate-in">
                                        <td>
                                            <div className="name-cell">
                                                <span className="student-name">{a.studentName}</span>
                                                <span className="student-class">{a.studentClass}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="time-text">{formatTime(a.checkInTime)}</span>
                                        </td>
                                        <td>
                                            <span className="location-text" title={a.location}>
                                                {a.location ? (a.location.length > 20 ? a.location.substring(0, 20) + '...' : a.location) : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${isSafe ? 'safe' : 'warning'}`}>
                                                {isSafe ? '✅ Hợp lệ' : '⚠️ Cảnh báo'}
                                            </span>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                defaultValue={a.note || ''}
                                                onBlur={(e) => handleNoteChange(a.id, e.target.value)}
                                                className="table-input"
                                                placeholder="..."
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </>
            );
        } else {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Học sinh</th>
                            <th>Mã sinh viên</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="empty-state">
                                    {allStudents.length === 0
                                        ? `Không lấy được danh sách học sinh của lớp ${className || ''}.`
                                        : 'Tất cả học sinh đã điểm danh!'}
                                </td>
                            </tr>
                        ) : (
                            students.map((student, idx) => (
                                <tr key={idx} className="attendee-row">
                                    <td>
                                        <div className="name-cell">
                                            <span className="student-name">{student.fullName}</span>
                                            <span className="student-class">{student.className}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="student-code">{student.studentCode}</span>
                                    </td>
                                    <td>
                                        <span className="status-pill warning"> Chưa điểm danh</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </>
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="attendance-modal-overlay">
            <div className="attendance-modal-card">
                <header className="modal-header">
                    <div className="header-info">
                        <h2>Điểm danh Tiết {period}</h2>
                        <p className="session-subtitle">Lớp {className || 'Đang cập nhật'}</p>
                    </div>
                    <button className="btn-close-x" onClick={onClose}>&times;</button>
                </header>

                <div className="attendance-modal-body">
                    <div className="qr-card">
                        <div className="qr-wrapper">
                            {(loading || !sessionId || !currentQrToken) ? (
                                <div className="qr-loading">
                                    <div className="pulse-spinner"></div>
                                    <p>Đang tạo mã...</p>
                                </div>
                            ) : (
                                <>
                                    <QRCodeCanvas
                                        value={studentUrl}
                                        size={220}
                                        level="H"
                                        includeMargin={true}
                                        imageSettings={{
                                            src: "/vite.svg",
                                            x: undefined,
                                            y: undefined,
                                            height: 40,
                                            width: 40,
                                            excavate: true,
                                        }}
                                    />
                                    <div className="qr-footer">
                                        <div className="timer-bar"><div className="timer-progress"></div></div>
                                        <p>Mã tự động đổi sau 10 giây</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="attendee-list-container">
                        {/* Tab Navigation */}
                        <div className="tab-navigation">
                            <button 
                                className={`tab-button ${activeTab === 'attended' ? 'active' : ''}`}
                                onClick={() => setActiveTab('attended')}
                            >
                                <span className="tab-text">Đã điểm danh</span>
                                <span className="tab-count">{attendances.length}</span>
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'unattended' ? 'active' : ''}`}
                                onClick={() => setActiveTab('unattended')}
                            >
                                <span className="tab-text">Chưa điểm danh</span>
                                <span className="tab-count">{unattendedStudents.length}</span>
                            </button>
                        </div>

                        <div className="attendance-table-wrapper">
                            <div className="table-body-scroll">
                                <table className="attendance-table">
                                    {renderAttendeeTable(activeTab === 'attended' ? attendances : unattendedStudents, activeTab === 'attended')}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Hủy bỏ</button>
                    <button className="btn-reset" onClick={async () => {
                        if (window.confirm("Xóa hết danh sách này?")) {
                            await clearAttendances(sessionId);
                            setAttendances([]);
                        }
                    }}>Xóa tất cả</button>
                    <button className="btn-primary" onClick={handleSave}>Hoàn tất điểm danh</button>
                </footer>
            </div>
        </div>
    );
};
export default AttendanceModal;
