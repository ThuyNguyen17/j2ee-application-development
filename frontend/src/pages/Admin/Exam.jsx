import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    ExamContainer,
    SidebarContainer,
    Content,
    ExamHeader,
    ExamForm,
    FormLabel,
    FormInput,
    AddButton
} from "../../styles/ExamStyles";

const AdminExamSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [examCategory, setExamCategory] = useState('');
    const [subject, setSubject] = useState('');
    const [marks, setMarks] = useState('');
    const [exams, setExams] = useState([]);
    const [editingExam, setEditingExam] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/exams/getall');
            setExams(response.data.exams || []);
        } catch (error) {
            console.error('Error fetching exams: ', error);
        }
    };

    const handleAddExam = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/v1/exams', {
                examCategory,
                subject,
                marks: parseInt(marks)
            });
            setExamCategory('');
            setSubject('');
            setMarks('');
            fetchExams();
            alert('Exam Result Added!');
        } catch (error) {
            console.error('Error adding exam: ', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this exam result?')) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/exams/${id}`);
                fetchExams();
            } catch (error) {
                console.error('Error deleting exam: ', error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/v1/exams/${editingExam.id}`, {
                ...editingExam,
                marks: parseInt(editingExam.marks)
            });
            setEditingExam(null);
            fetchExams();
            alert('Exam Result Updated!');
        } catch (error) {
            console.error('Error updating exam: ', error);
        }
    };

    return (
        <ExamContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ExamContent>
                    <ExamHeader>Admin: Exam Results Management</ExamHeader>
                    
                    {editingExam ? (
                        <AddExamForm onSubmit={handleUpdate}>
                            <h3>Edit Exam Result</h3>
                            <ExamInput
                                type="text"
                                value={editingExam.examCategory}
                                onChange={(e) => setEditingExam({ ...editingExam, examCategory: e.target.value })}
                                placeholder="Exam Category"
                                required
                            />
                            <ExamInput
                                type="text"
                                value={editingExam.subject}
                                onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}
                                placeholder="Subject"
                                required
                            />
                            <ExamInput
                                type="number"
                                value={editingExam.marks}
                                onChange={(e) => setEditingExam({ ...editingExam, marks: e.target.value })}
                                placeholder="Marks"
                                required
                            />
                            <AddExamButton type="submit">Update</AddExamButton>
                            <AddExamButton type="button" onClick={() => setEditingExam(null)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</AddExamButton>
                        </AddExamForm>
                    ) : (
                        <AddExamForm onSubmit={handleAddExam}>
                            <h3>Add Exam Result</h3>
                            <ExamInput
                                type="text"
                                placeholder="Exam Category (e.g., Midterm)"
                                value={examCategory}
                                onChange={(e) => setExamCategory(e.target.value)}
                                required
                            />
                            <ExamInput
                                type="text"
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                            <ExamInput
                                type="number"
                                placeholder="Marks"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                required
                            />
                            <AddExamButton type="submit">Add Exam</AddExamButton>
                        </AddExamForm>
                    )}

                    <ExamList>
                        {exams.length > 0 ? exams.map((exam) => (
                            <ExamItem key={exam.id}>
                                <div>
                                    <strong>{exam.examCategory}</strong>: {exam.subject} - {exam.marks} Marks
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => setEditingExam(exam)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(exam.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </ExamItem>
                        )) : <p>No exam results found.</p>}
                    </ExamList>
                </ExamContent>
            </Content>
        </ExamContainer>
    );
};

export default AdminExamSection;