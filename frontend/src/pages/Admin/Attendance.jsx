import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
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

const Attendance = () => {    const [isOpen, setIsOpen] = useState(true);    const [students, setStudents] = useState({});
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/students/getall');
            setStudents(response.data.students);
            initializeAttendanceData(response.data.students);
        } catch (error) {
            console.error('Error fetching students: ', error);
        }
    };

    const initializeAttendanceData = (students) => {
        const initialAttendanceData = students.map((student) => ({
            id: student.id,
            name: student.name,
            status: 'Present'
        }));
        setAttendanceData(initialAttendanceData)
    };

    const handleStatusChange = (id, status) => {
        const updateData = attendanceData.map((student) => {
            if (students.id == id) {
                return { ...student, status }
            }
            return student
        });
        setAttendanceData(initializeAttendanceData)
    };

    const handleSubmit = async () => {
        try {
            const formattedData = attendanceData.map(({ id, name, status }) => ({ studentId: id, name, status }));
            const response = await axios.post('http://localhost:4000/api/v1/attendance', { attendanceData: formattedData });
        } catch (error) {
            console.error('Error submitting attendance data: ', error)
        }
    };

    return (
        <AttendanceContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AttendanceContent>
                    <AttendanceHeader>Attendance</AttendanceHeader>
                    <AttendanceList>
                        {StudentName.map((student, index) => (
                            <React.Fragment key={student.id}>
                                <AttendanceItem>
                                    <StudentName></StudentName>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            checked={ attendanceData[index]?.status === "Present"}
                                            onChange={ () => handleStatusChange(student.id, "Present") }
                                        />
                                        Present
                                    </CheckboxLabel>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            checked={ attendanceData[index]?.status === "Absent"}
                                            onChange={ () => handleStatusChange(student.id, "Absent") }
                                        />
                                        Absent
                                    </CheckboxLabel>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            checked={ attendanceData[index]?.status === "Adsent with Apologgy"}
                                            onChange={ () => handleStatusChange(student.id, "Absent with Apololy") }
                                        />
                                        Absent with apology
                                    </CheckboxLabel>
                                </AttendanceItem>
                                { index !== students.length - 1 && <Divider /> }
                            </React.Fragment>
                        ))}
                    </AttendanceList>
                    <SubmitButton onClick={ handleSubmit }>Submit</SubmitButton>
                </AttendanceContent>
            </Content>
        </AttendanceContainer>
    )
};

export default Attendance;