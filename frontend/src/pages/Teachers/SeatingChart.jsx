import React from 'react';
import ClassroomSeatingChart from '../../components/ClassroomSeatingChart';

const SeatingChart = () => {
    return (
        <div style={{ padding: '20px' }}>
            <ClassroomSeatingChart role="teacher" />
        </div>
    );
};

export default SeatingChart;
