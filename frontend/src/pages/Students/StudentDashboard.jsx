import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, History, GraduationCap, User, CalendarDays, FileText, BookOpen } from 'lucide-react';
import { normalizeClassName } from '../../utils/classNameUtils';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/student/login');
                return;
            }
            const user = JSON.parse(storedUser);
            if (!user) {
                navigate('/student/login');
                return;
            }
            if (user.role === 'TEACHER') {
                navigate('/teacher/dashboard');
                return;
            }
            if (user.role !== 'STUDENT') {
                navigate('/student/login');
                return;
            }
            setStudent({ ...user, className: normalizeClassName(user.className) });
        } catch (e) {
            navigate('/student/login');
        }
    }, [navigate]);

    if (!student) return null;

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Student Dashboard</h1>
                <p className="dashboard-subtitle">Chào mừng trở lại, {student.fullName}!</p>
            </div>

            <div className="profile-section">
                <div className="profile-card">
                    <div className="profile-avatar">
                        <User size={40} />
                    </div>
                    <div className="profile-info">
                        <h2>{student.fullName}</h2>
                        <p className="student-code">{student.studentCode}</p>
                        <div className="class-badge">
                            <GraduationCap size={16} />
                            <span>Lớp: {student.className}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="actions-section">
                <button className="action-card history-card" onClick={() => navigate('/student/timetable')}>
                    <div className="icon-wrapper">
                        <CalendarDays size={32} />
                    </div>
                    <div className="action-text">
                        <h3>Thời khóa biểu</h3>
                        <p>Xem lịch học tuần này</p>
                    </div>
                </button>

                <button className="action-card scan-card" onClick={() => navigate('/student/scan')}>
                    <div className="icon-wrapper">
                        <QrCode size={32} />
                    </div>
                    <div className="action-text">
                        <h3>Điểm danh QR</h3>
                        <p>Quét mã để điểm danh</p>
                    </div>
                </button>

                <button className="action-card history-card" onClick={() => navigate('/student/history')}>
                    <div className="icon-wrapper">
                        <History size={32} />
                    </div>
                    <div className="action-text">
                        <h3>Lịch sử điểm danh</h3>
                        <p>Xem lại các môn đã học</p>
                    </div>
                </button>

                <button className="action-card" onClick={() => navigate('/student/assignments')}>
                    <div className="icon-wrapper">
                        <FileText size={32} />
                    </div>
                    <div className="action-text">
                        <h3>Bài tập</h3>
                        <p>Xem và nộp bài tập</p>
                    </div>
                </button>

                <button className="action-card" onClick={() => navigate('/student/library')}>
                    <div className="icon-wrapper">
                        <BookOpen size={32} />
                    </div>
                    <div className="action-text">
                        <h3>Thư viện</h3>
                        <p>Tài liệu học tập</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default StudentDashboard;
