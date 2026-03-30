import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    TeacherDashboardContainer,
    Content,
    Section,
    SectionTitle,
    CardContainer,
    Card,
    CardTitle,
    CardContent
} from "../../styles/DashboardStyles";

const TeacherDashboard = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0, assignments: 0, announcements: 0 });

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const [studentRes, teacherRes, classRes, assignRes, announceRes] = await Promise.all([
                axios.get('http://localhost:8080/api/students'),
                axios.get('http://localhost:8080/api/v1/teachers/getall'),
                axios.get('http://localhost:8080/api/v1/class/getall'),
                axios.get('http://localhost:8080/api/v1/assignments/getall'),
                axios.get('http://localhost:8080/api/v1/announcements/getall')
            ]);
            
            setCounts({
                students: studentRes.data?.length || 0,
                teachers: teacherRes.data?.teachers?.length || 0,
                classes: classRes.data?.classes?.length || 0,
                assignments: assignRes.data?.assignments?.length || 0,
                announcements: announceRes.data?.announcements?.length || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard counts: ', error);
        }
    }
    
    return(
        <TeacherDashboardContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                    <Section>
                        <SectionTitle>Teacher Dashboard Overview</SectionTitle>
                        <CardContainer>
                            <Card>
                                <CardTitle>Total Students</CardTitle>
                                <CardContent>{counts.students}</CardContent>
                            </Card>
                            <Card>
                                <CardTitle>Classes</CardTitle>
                                <CardContent>{counts.classes}</CardContent>
                            </Card>
                            <Card>
                                <CardTitle>Assignments</CardTitle>
                                <CardContent>{counts.assignments}</CardContent>
                            </Card>
                            <Card>
                                <CardTitle>Announcements</CardTitle>
                                <CardContent>{counts.announcements}</CardContent>
                            </Card>
                        </CardContainer>
                    </Section>

                    <Section>
                        <SectionTitle>Recent Activity</SectionTitle>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <p>You have {counts.assignments} active assignments and {counts.announcements} announcements posted.</p>
                        </div>
                    </Section>

                    <Section>
                        <SectionTitle>Upcoming Events</SectionTitle>
                        <p>Stay tuned for school events.</p>
                    </Section>
            </Content>
        </TeacherDashboardContainer>
    )
}

export default TeacherDashboard