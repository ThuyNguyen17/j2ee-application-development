import React from 'react';

const TimetableControls = ({
    options = {}, // { academicYears, semesters, weeks }
    values = {}, // { selectedAcademicYear, selectedSemester, selectedWeek }
    onChange = {}, // { onYearSemesterChange, onWeekChange }
    onPrint
}) => {
    const { semesterOptions = [], weekOptions = [] } = options;
    const { selectedAcademicYear, selectedSemester, selectedWeek } = values;
    const { onYearSemesterChange, onWeekChange } = onChange;

    return (
        <div className="timetable-controls">
            <div className="controls-left">
                <label>
                    Chọn học kỳ xem TKB:
                    <select
                        value={`${selectedAcademicYear}-${selectedSemester}`}
                        onChange={onYearSemesterChange}
                    >
                        {semesterOptions.map((option) => (
                            <option
                                key={`${option.academicYear}-${option.semester}`}
                                value={`${option.academicYear}-${option.semester}`}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Xem dạng tuần:
                    <select
                        value={selectedWeek}
                        onChange={onWeekChange}
                    >
                        {weekOptions.map((week) => (
                            <option key={week.value} value={week.value}>
                                {week.fullLabel}
                            </option>
                        ))}
                    </select>
                </label>

                {onPrint && (
                    <button className="print-button" onClick={onPrint}>
                        In TKB
                    </button>
                )}
            </div>
        </div>
    );
};

export default TimetableControls;
