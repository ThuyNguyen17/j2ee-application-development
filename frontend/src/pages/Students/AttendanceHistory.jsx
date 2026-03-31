import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentSubjects } from '../../api/studentApi';
import { ArrowLeft, BookOpen, ChevronRight} from 'lucide-react';
import { normalizeClassName } from '../../utils/classNameUtils';
import './AttendanceHistory.css';

const AttendanceHistory = () => {
    const [student, setStudent] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
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
            fetchSubjects(s.studentId);
        } catch (e) {
            navigate('/student/login');
        }
    }, [navigate]);

    const fetchSubjects = async (studentId) => {
        try {
            const data = await getStudentSubjects(studentId);
            setSubjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="history-page loading">
            <div className="spinner"></div>
            <p>Đang tải danh sách môn học...</p>
        </div>
    );

    return (
        <div className="history-page">
            <header className="history-header">
                <button onClick={() => navigate('/student/dashboard')} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2>Lịch sử điểm danh</h2>
            </header>

            <main className="history-main">
                <div className="subject-list">
                    {subjects.length === 0 ? (
                        <div className="empty-state">
                            <BookOpen size={48} />
                            <p>Chưa có dữ liệu môn học nào</p>
                        </div>
                    ) : (
                        subjects.map(subject => (
                            <div
                                key={subject.assignmentId}
                                className="subject-item"
                                onClick={() => navigate(`/student/subject/${subject.assignmentId}`)}
                            >
                                <div className="subject-icon">
                                    <BookOpen size={24} />
                                </div>
                                <div className="subject-details">
                                    <h3>{subject.subjectName}</h3>
                                    <p>GV: {subject.teacherName}</p>
                                </div>
                                <div className="subject-stats">
                                    <div className="stat-badge">
                                        <span className="count">{subject.attendedSessions}/{subject.totalSessions}</span>
                                        <span className="label">buổi</span>
                                    </div>
                                    <ChevronRight size={20} color="#94a3b8" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default AttendanceHistory;
