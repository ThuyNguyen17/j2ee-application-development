import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import {
    PerformanceContainer,
    Content,
    PerformanceHeader,
    PerformanceInfo,
    PerformanceGraphContainer,
    TotalMarks
} from "../../styles/PerformanceStyles";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceSection = () =>{
    const [isOpen, setIsOpen] = useState(true);

    const performanceData = {
        months: ['January', 'February', 'March', 'April', 'May'],
        marks: [85, 90, 78, 92, 88],
        totalMarks: 433
    };

    const lineGraphData = {
        labels: performanceData.months,
        datasets: [
            {
                label: 'Performance Trends',
                fill: false,
                borderColor: '#4b83b5',
                tension: 0.1,
                data: performanceData.marks
            }
        ]
    };

    return(
        <PerformanceContainer>
            <Content isOpen={isOpen}>
                <PerformanceHeader>Academic Performance Trends</PerformanceHeader>
                <PerformanceInfo>
                    <PerformanceGraphContainer style={{ maxWidth: '800px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <Line 
                            data={lineGraphData}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100
                                    }
                                }
                            }}
                        />
                    </PerformanceGraphContainer>
                    <TotalMarks style={{ marginTop: '20px' }}>Current Average: 86.6%</TotalMarks>
                </PerformanceInfo>
            </Content>
        </PerformanceContainer>
    )
}

export default PerformanceSection;
