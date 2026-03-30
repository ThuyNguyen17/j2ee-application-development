import React from 'react';
import ClassroomSeatingChart from '../../components/ClassroomSeatingChart';

const SeatingChart = () => {
    return (
        <div style={{ padding: '20px' }}>
            <ClassroomSeatingChart role="admin" />
        </div>
    );
};

export default SeatingChart;
