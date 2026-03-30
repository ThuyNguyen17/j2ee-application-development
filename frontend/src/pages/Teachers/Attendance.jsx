import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    startSession as startSessionApi,
    updateQrToken,
    getAttendances,
    closeSession as closeSessionApi
} from "../../api/attendanceApi";
import {
    AttendanceContainer,
    Content,
    AttendanceContent,
    AttendanceHeader,
    AttendanceList,
    AttendanceItem,
    StudentName,
    CheckboxLabel,
    Divider,
    SubmitButton
} from "../../styles/AttendanceStyles";

const CheckAttendanceSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState("");
    const [currentSession, setCurrentSession] = useState(null);
    const [checkins, setCheckins] = useState([]);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        fetchAssignments();
        return () => clearInterval(timer);
    }, [timer]);

    const fetchAssignments = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            console.log('Stored user:', storedUser);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log('Parsed user:', user);
                console.log('Using teacherId:', user.teacherId || user.userId);
                const teacherId = user.teacherId || user.userId;
                if (!teacherId) {
                    alert('Không tìm thấy teacherId trong user object');
                    return;
                }
                const response = await axios.get(`http://localhost:8080/api/v1/teaching-assignments/teacher/${teacherId}`);
                console.log('Assignments response:', response.data);
                setAssignments(response.data || []);
            } else {
                alert('Vui lòng đăng nhập lại');
            }
        } catch (error) {
            console.error('Error fetching assignments: ', error);
            alert('Lỗi lấy danh sách lớp: ' + (error.response?.data?.message || error.message));
        }
    };

    const startSession = async () => {
        if (!selectedAssignment) return alert("Vui lòng chọn lớp học!");
        try {
            const session = await startSessionApi(
                selectedAssignment,
                new Date().toISOString().split('T')[0],
                1,
                1,
                null,
                null
            );
            setCurrentSession(session);
            generateToken(session.id);
            startMonitoring(session.id);
        } catch (error) {
            console.error('Error starting session: ', error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert('Failed to create attendance session: ' + errorMsg);
        }
    };

    const generateToken = async (sessionId) => {
        const token = Math.random().toString(36).substring(2, 10).toUpperCase();
        try {
            const session = await updateQrToken(sessionId, token);
            setCurrentSession(session);
        } catch (error) {
            console.error('Error generating token:', error);
            alert('Failed to generate token: ' + (error.response?.data?.message || error.message));
        }
    };

    const startMonitoring = (sessionId) => {
        const t = setInterval(async () => {
            try {
                const attendances = await getAttendances(sessionId);
                setCheckins(attendances);
            } catch (error) {
                console.error('Error fetching attendances:', error);
            }
        }, 5000);
        setTimer(t);
    };

    const closeSession = async () => {
        if (!currentSession) return;
        try {
            await closeSessionApi(currentSession.id);
            clearInterval(timer);
            setTimer(null);
            alert("Session closed!");
            setCurrentSession(null);
            setCheckins([]);
        } catch (error) {
            console.error('Error closing session:', error);
            alert('Failed to close session: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <AttendanceContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AttendanceContent>
                    <AttendanceHeader>Attendance Management</AttendanceHeader>
                    
                    {!currentSession ? (
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3>Start New Session</h3>
                            <select 
                                onChange={(e) => setSelectedAssignment(e.target.value)}
                                style={{ padding: '10px', width: '300px', marginBottom: '15px', borderRadius: '4px' }}
                            >
                                <option value="">Select a Class...</option>
                                {assignments.map(a => (
                                    <option key={a.id} value={a.id}>{a.className} - {a.subjectName}</option>
                                ))}
                            </select>
                            <br />
                            <SubmitButton onClick={startSession}>Start Session</SubmitButton>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '300px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                                <h3>Active Session</h3>
                                <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#4b83b5', textAlign: 'center', padding: '20px', border: '2px dashed #4b83b5', margin: '20px 0' }}>
                                    {currentSession.qrToken || "WAITING..."}
                                </div>
                                <p style={{ textAlign: 'center' }}>Học sinh quét mã QR hoặc nhập mã này để điểm danh.</p>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <SubmitButton onClick={() => generateToken(currentSession.id)}>Refresh Token</SubmitButton>
                                    <SubmitButton onClick={closeSession} style={{ backgroundColor: '#dc3545' }}>Close Session</SubmitButton>
                                </div>
                            </div>

                            <div style={{ flex: '1.5', minWidth: '400px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                                <h3>Checked-in Students ({checkins.length})</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                            <th style={{ padding: '10px' }}>Tên</th>
                                            <th style={{ padding: '10px' }}>Lớp</th>
                                            <th style={{ padding: '10px' }}>Giờ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkins.map(c => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px' }}>{c.studentName}</td>
                                                <td style={{ padding: '10px' }}>{c.studentClass}</td>
                                                <td style={{ padding: '10px' }}>{c.checkInTime}</td>
                                            </tr>
                                        ))}
                                        {checkins.length === 0 && (
                                            <tr>
                                                <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Chưa có sinh viên nào điểm danh.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </AttendanceContent>
            </Content>
        </AttendanceContainer>
    );
}

export default CheckAttendanceSection;
