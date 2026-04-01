import React from 'react';

const ScheduleCell = ({ subject, studentClass, room, note }) => {
    return (
        <div className="schedule-content">
            <div className="subject-row">
                <span className="subject-info">{subject}</span>
            </div>

            <div className="meta-row">
                {studentClass && (
                    <div className="meta-item class-tag">
                        <span className="meta-icon">👥</span>
                        <span>{studentClass}</span>
                    </div>
                )}
                {room && (
                    <div className="meta-item room-tag">
                        <span className="meta-icon">📍</span>
                        <span>{room}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleCell;
