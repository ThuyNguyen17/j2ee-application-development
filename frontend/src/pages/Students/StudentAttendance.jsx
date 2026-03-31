import React, { useState, useEffect } from "react";
import {
    AttendanceContainer,
    Content,
    AttendanceHeader,
    AttendanceStatus
} from "../../styles/AttendanceStyles";

const AttendanceSection = () =>{

    const [isOpen, setIsOpen] = useState(true);

    const attendance = [
        { id: 1, date: '2026-01-01', present: true },
        { id: 2, date: '2026-01-02', present: false },
        { id: 3, date: '2026-01-03', present: true },
        { id: 4, date: '2026-01-04', present: true },
        { id: 5, date: '2026-01-05', present: false }
    ];

    return(
        <AttendanceContainer>
            <Content isOpen={isOpen}>
                <AttendanceHeader>Lịch sử điểm danh</AttendanceHeader>
                <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '10px' }}>Lớp học</th>
                                <th style={{ padding: '10px' }}>Giờ điểm danh</th>
                                <th style={{ padding: '10px' }}>Trạng thái</th>
                                <th style={{ padding: '10px' }}>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length > 0 ? (
                                attendance.map((record) => (
                                    <tr key={record.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{record.studentClass}</td>
                                        <td style={{ padding: '10px' }}>{record.checkInTime}</td>
                                        <td style={{ padding: '10px' }}>
                                            <AttendanceStatus present={record.status === 'PRESENT'}>
                                                {record.status}
                                            </AttendanceStatus>
                                        </td>
                                        <td style={{ padding: '10px' }}>{record.note || 'None'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Chưa có dữ liệu điểm danh</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Content>
        </AttendanceContainer>
    )
}

export default AttendanceSection;