import React from 'react';
import './Timetable.css';

const TimetableGrid = ({
    periods = [],
    days = [],
    renderCellContent,
    getCellClassName
}) => {
    return (
        <div className="table-wrapper">
            <table className="timetable-grid">
                <thead>
                    <tr>
                        <th className="period-header">TIẾT</th>
                        {days.map((day) => (
                            <th key={day.key}>{day.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {periods.map((period) => (
                        <tr key={period.id}>
                            <td className="period-cell">
                                <div>Tiết {period.id}</div>
                                <div>({period.start})</div>
                            </td>
                            {days.map((day) => {
                                const content = renderCellContent ? renderCellContent(day, period) : null;
                                const className = getCellClassName ? getCellClassName(content, day, period) : '';

                                return (
                                    <td
                                        key={`${day.key}-${period.id}`}
                                        className={className}
                                    >
                                        {content}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimetableGrid;
