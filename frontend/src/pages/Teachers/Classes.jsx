import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    ClassContainer,
    Content,
    ClassesContent,
    ClassHeader,
    AddClassForm,
    AddClassButton,
    AddClassInput,
    ClassList,
    ClassItem
} from "../../styles/ClassesStyles";

const ClassesSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [newClass, setNewClass] = useState({ gradeLevel: '', className: '' });
    const [classes, setClasses] = useState([]);
    const [editingClass, setEditingClass] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/class/getall');
            // Kiểm tra cấu trúc data từ backend của bạn
            if (response.data && Array.isArray(response.data.classes)) {
                setClasses(response.data.classes);
            } else if (Array.isArray(response.data)) {
                setClasses(response.data);
            }
        } catch (error) {
            console.error('Error fetching classes: ', error);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        if (newClass.className.trim() !== '' && newClass.gradeLevel !== '') {
            try {
                await axios.post('http://localhost:8080/api/v1/class', newClass);
                fetchClasses();
                setNewClass({ gradeLevel: '', className: '' });
            } catch (error) {
                console.error("Error adding class: ", error);
            }
        }
    };

    const handleDeleteClass = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/class/${id}`);
                fetchClasses();
            } catch (error) {
                console.error('Error deleting class: ', error);
            }
        }
    };

    const handleUpdateClass = async (e) => {
        e.preventDefault();
        try {
            // Lưu ý: MongoDB dùng _id, nếu backend trả về _id thì sửa thành editingClass._id
            const id = editingClass.id || editingClass._id;
            await axios.put(`http://localhost:8080/api/v1/class/${id}`, editingClass);
            setEditingClass(null);
            fetchClasses();
        } catch (error) {
            console.error('Error updating class: ', error);
        }
    };

    return (
        <ClassContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ClassesContent>
                    <ClassHeader>Classes Management</ClassHeader>

                    {editingClass ? (
                        <AddClassForm onSubmit={handleUpdateClass}>
                            <h3>Edit Class</h3>
                            <AddClassInput
                                type="number"
                                value={editingClass.gradeLevel}
                                onChange={(e) => setEditingClass({ ...editingClass, gradeLevel: e.target.value })}
                            />
                            <AddClassInput
                                type="text"
                                value={editingClass.className}
                                onChange={(e) => setEditingClass({ ...editingClass, className: e.target.value })}
                            />
                            <AddClassButton type="submit">Update</AddClassButton>
                            <AddClassButton type="button" onClick={() => setEditingClass(null)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</AddClassButton>
                        </AddClassForm>
                    ) : (
                        <AddClassForm onSubmit={handleAddClass}>
                            <AddClassInput
                                type="number"
                                placeholder="Grade Level (e.g. 10)"
                                value={newClass.gradeLevel}
                                onChange={(e) => setNewClass({ ...newClass, gradeLevel: e.target.value })}
                            />
                            <AddClassInput
                                type="text"
                                placeholder="Class Name (e.g. A1)"
                                value={newClass.className}
                                onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                            />
                            <AddClassButton type="submit">Add Class</AddClassButton>
                        </AddClassForm>
                    )}

                    <ClassList>
                        {Array.isArray(classes) && classes.map((item, index) => (
                            <ClassItem key={item.id || item._id || index}>
                                <div>
                                    Grade: {item.gradeLevel} - Class: {item.className}
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => setEditingClass(item)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDeleteClass(item.id || item._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </ClassItem>
                        ))}
                    </ClassList>
                </ClassesContent>
            </Content>
        </ClassContainer>
    );
}

export default ClassesSection;
