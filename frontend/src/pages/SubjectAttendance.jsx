
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttendanceDetails } from '../api/studentApi';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, MapPin, Info } from 'lucide-react';
import { normalizeClassName } from '../utils/classNameUtils';
import './SubjectAttendance.css';

const SubjectAttendance = () => {
    const { assignmentId } = useParams();
    const [student, setStudent] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/student/login');
                return;
            }
            const s = JSON.parse(storedUser);
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
            setStudent({ ...s, className: normalizeClassName(s.className) });
            fetchSessions(s.studentId);
        } catch (e) {
            navigate('/student/login');
        }
    }, [assignmentId, navigate]);

    const fetchSessions = async (studentId) => {
        try {
            const data = await getAttendanceDetails(studentId, assignmentId);
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setSelectedSession(null);

    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--';
        return timeStr.substring(0, 5);
    };

    if (loading) return (
        <div className="history-page loading">
            <div className="spinner"></div>
            <p>Đang tải chi tiết điểm danh...</p>
        </div>
    );

    return (
        <div className="subject-attendance-page">
            <header className="history-header">
                <button onClick={() => navigate('/student/history')} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Chi Tiết Điểm Danh</h2>
            </header>

            <main className="subject-attendance-main">
                <div className="session-grid">
                    {sessions.map((session, index) => (
                        <div
                            key={session.sessionId || index}
                            className={`session-card ${session.isPresent ? 'present' : 'absent'}`}
                            onClick={() => setSelectedSession(session)}
                        >
                            <div className="session-header">
                                <span className="session-date">{new Date(session.date).toLocaleDateString('vi-VN')}</span>
                                <span className="session-tag">Buổi {index + 1}</span>
                            </div>
                            <div className="session-content">
                                <div className="status-label">
                                    {session.isPresent ? (
                                        <><CheckCircle size={16} /> Có mặt</>
                                    ) : (
                                        <><XCircle size={16} /> Vắng mặt</>
                                    )}
                                </div>
                                <div className="period-label">Tiết {session.period}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedSession && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết buổi học</h3>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-item">
                                <Calendar size={18} />
                                <div>
                                    <label>Ngày học</label>
                                    <p>{new Date(selectedSession.date).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Clock size={18} />
                                <div>
                                    <label>Tiết học / Giờ điểm danh</label>
                                    <p>Tiết {selectedSession.period} • {formatTime(selectedSession.checkInTime)}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <MapPin size={18} />
                                <div>
                                    <label>Vị trí điểm danh</label>
                                    <p>{selectedSession.location || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Info size={18} />
                                <div>
                                    <label>Loại điểm danh / Ghi chú</label>
                                    <p>{selectedSession.isPresent ? (selectedSession.attendanceType || 'QR') : 'Vắng'} {selectedSession.note ? `• ${selectedSession.note}` : ''}</p>
                                </div>
                            </div>
                            <div className={`status-banner ${selectedSession.isPresent ? 'present' : 'absent'}`}>
                                {selectedSession.isPresent ? 'BẠN ĐÃ CÓ MẶT' : 'BẠN ĐÃ VẮNG MẶT'}
                            </div>
                        </div>
                        <button className="modal-close-button" onClick={closeModal}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectAttendance
