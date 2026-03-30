import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    PerformanceContainer,
    Content,
    PerformanceContent,
    PerformanceHeader,
    SchoolPerformance,
    IndividualPerformance
} from "../../styles/PerformanceStyles";

const Performance = () =>{
    const [isOpen, setIsOpen] = useState(true);
    //
    const schoolPerformanceData = {
        averageScore: 85,
        totalStudents: 100,
    };

    //
    const individualPerformanceData = [
        { id: 1, name: "John Doe", score: 90 },
        { id: 2, name: "Jane Smith", score: 80 },
        { id: 3, name: "Alice Johnson", score: 85 },
    ];

    return(
        <PerformanceContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <PerformanceContent>
                    <PerformanceHeader>School Performance</PerformanceHeader>
                    <SchoolPerformance>
                        <p>Average Score: {schoolPerformanceData.averageScore}</p>
                        <p>Total Students: {schoolPerformanceData.totalStudents}</p>
                    </SchoolPerformance>
                    <PerformanceHeader>Individual Performance</PerformanceHeader>
                    <IndividualPerformance>
                        {individualPerformanceData.map(student => (
                            <p key={student.id}>
                                {student.name}: {student.score}
                            </p>
                        ))}
                    </IndividualPerformance>
                </PerformanceContent>
            </Content>
        </PerformanceContainer>
    )
}

export default Performance