import React from 'react';

const TimetablePagination = ({
    selectedWeek,
    totalWeeks,
    onFirstWeek,
    onPreviousWeek,
    onNextWeek,
    onLastWeek
}) => {
    return (
        <div className="footer-buttons">
            <button onClick={onFirstWeek} disabled={selectedWeek === 1}>
                Tuần Đầu
            </button>
            <button onClick={onPreviousWeek} disabled={selectedWeek === 1}>
                Tuần Trước
            </button>
            <button onClick={onNextWeek} disabled={selectedWeek === totalWeeks}>
                Tuần Kế
            </button>
            <button onClick={onLastWeek} disabled={selectedWeek === totalWeeks}>
                Tuần Cuối
            </button>
        </div>
    );
};

export default TimetablePagination;
