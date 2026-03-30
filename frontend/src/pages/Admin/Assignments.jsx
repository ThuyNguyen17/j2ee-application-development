import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    AssignmentsContainer,
    Content,
    AssignmentsContent,
    AssignmentsHeader,
    AssignmentList,
    AssignmentItem,
    AddAssignmentForm,
    AddAssignmentInput,
    AddAssignmentTextArea,
    AddAssignmentButton
} from "../../styles/AssignmentsStyles";

const Assignments = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [newAssignment, setNewAssignment] = useState({title: '', description: '', grade: '', deadline: ''});
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssigments();
    }, []);

    const fetchAssigments = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/assignments/getall');
            setAssignments(response.data.assignments);
        }catch (error){
            console.error('Error fetching assignments: ', error);
        }
    };

    const handleAddAssigment = async (e) => {
        e.preventDefault();
        if(newAssignment.title.trim() !== '' && newAssignment.description.trim() !== '' && newAssignment.grade.trim() !== '' && newAssignment.deadline.trim() !== ''){
            try{
                const response = await axios.post('http://localhost:8080/api/v1/assignments', newAssignment);
                setAssignments([...assignments, response.data.assignment]);
                setNewAssignment({ title: '', description: '', grade: '', deadline: ''});
            }catch (error){
                console.error("Error adding assignment: ", error);
            }
        }
    };

    return(
        <AssignmentsContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AssignmentsContent>
                    <AssignmentsHeader>Assignments</AssignmentsHeader>
                    <AddAssignmentForm onSubmit={handleAddAssigment}>
                        <AddAssignmentInput
                            type="text"
                            placeholder="Enter Assignment Title"
                            value={newAssignment.title}
                            onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                        />
                        <AddAssignmentTextArea
                            placeholder="Enter Assignment Description"
                            value={newAssignment.description}
                            onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                        />
                        <AddAssignmentInput
                            type="text"
                            placeholder="Enter Assignment Grade"
                            value={newAssignment.grade}
                            onChange={(e) => setNewAssignment({...newAssignment, grade: e.target.value})}
                        />
                        <AddAssignmentInput
                            type="text"
                            placeholder="Enter Assignment Deadline"
                            value={newAssignment.deadline}
                            onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                        />
                        <AddAssignmentButton type="submit">Add Assignment</AddAssignmentButton>
                    </AddAssignmentForm>

                    <AssignmentList>
                        {assignments.map((assignment) => (
                            <AssignmentItem key={assignment.id}>
                                <strong>{assignment.title}: </strong>
                                {assignment.description}, {assignment.grade}, {assignment.deadline}
                            </AssignmentItem>
                        ))}
                    </AssignmentList>
                </AssignmentsContent>
            </Content>
        </AssignmentsContainer>
    )
}

export default Assignments