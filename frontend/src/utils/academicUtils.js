/**
 * Academic Year and Semester Utilities for Vietnamese High School System
 * 
 * Academic Year Structure:
 * - HK1 (Semester 1): September 1 - End of December (approx 18 weeks)
 * - HK2 (Semester 2): Mid-January (after Tet) - End of May (approx 18 weeks)
 * - Summer Break: June - August
 */

// Helper to find the Monday of the week containing the date
const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

// Configuration constants
const SEMESTER_CONFIG = {
    SEMESTER_1: {
        START_MONTH: 9,  // September
        START_DAY: 1,
        MAX_WEEKS: 18
    },
    SEMESTER_2: {
        START_MONTH: 1,  // January
        START_DAY: 15,   // Usually starts mid-January after Tet
        MAX_WEEKS: 18
    }
};

/**
 * Get current academic year and semester based on today's date
 * @returns {Object} { academicYear, academicYearLabel, semester }
 */
export function getCurrentAcademicInfo() {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const year = today.getFullYear();

    let academicYearStart;
    let semester;

    if (month >= 9) {
        // September - December: Semester 1 of current academic year
        academicYearStart = year;
        semester = 1;
    } else if (month >= 1 && month <= 5) {
        // January - May: Semester 2 of previous academic year
        academicYearStart = year - 1;
        semester = 2;
    } else {
        // June - August: Summer break
        academicYearStart = year - 1;
        semester = 0; // Summer break
    }

    return {
        academicYear: academicYearStart,
        academicYearLabel: `${academicYearStart}-${academicYearStart + 1}`,
        semester,
    };
}

/**
 * Calculate current week number within a semester
 * @param {number} semester - 1 or 2
 * @param {number} academicYearStart - Starting year of academic year (e.g., 2024 for 2024-2025)
 * @returns {number} Current week number (1-18)
 */
export function getCurrentWeek(semester, academicYearStart) {
    const today = new Date();
    let semesterStart;

    if (semester === 1) {
        // HK1 starts September 1st
        semesterStart = getMonday(new Date(academicYearStart, 8, 1));
    } else if (semester === 2) {
        // HK2 starts mid-January
        semesterStart = getMonday(new Date(academicYearStart + 1, 0, SEMESTER_CONFIG.SEMESTER_2.START_DAY));
    } else {
        return 1;
    }

    // Calculate difference in days
    const diffTime = today - semesterStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate week number (1-indexed)
    const week = Math.floor(diffDays / 7) + 1;

    // Get max weeks for this semester
    const maxWeeks = semester === 1
        ? SEMESTER_CONFIG.SEMESTER_1.MAX_WEEKS
        : SEMESTER_CONFIG.SEMESTER_2.MAX_WEEKS;

    // Ensure week is within valid range
    if (week < 1) return 1;
    if (week > maxWeeks) return maxWeeks;

    return week;
}

/**
 * Generate list of academic years for dropdown
 * @param {number} yearsBack - How many years back to include
 * @param {number} yearsForward - How many years forward to include
 * @returns {Array} Array of academic year objects
 */
export function generateAcademicYears(yearsBack = 2, yearsForward = 1) {
    const currentInfo = getCurrentAcademicInfo();
    const currentYear = currentInfo.academicYear;
    const years = [];

    for (let i = -yearsBack; i <= yearsForward; i++) {
        const year = currentYear + i;
        years.push({
            value: year,
            label: `${year}-${year + 1}`,
            isCurrent: year === currentYear
        });
    }

    return years;
}

/**
 * Generate list of weeks for a specific semester
 * @param {number} semester - 1 or 2
 * @param {number} academicYearStart - Starting year of academic year
 * @returns {Array} Array of week objects with date ranges
 */
export function generateWeeksForSemester(semester, academicYearStart) {
    const weeks = [];
    let semesterStart;

    if (semester === 1) {
        semesterStart = getMonday(new Date(academicYearStart, 8, 1));
    } else if (semester === 2) {
        semesterStart = getMonday(new Date(academicYearStart + 1, 0, SEMESTER_CONFIG.SEMESTER_2.START_DAY));
    } else {
        return weeks;
    }
    
    semesterStart.setHours(12, 0, 0, 0); // Chuẩn hóa giờ để tránh lệch ngày do múi giờ

    const maxWeeks = semester === 1
        ? SEMESTER_CONFIG.SEMESTER_1.MAX_WEEKS
        : SEMESTER_CONFIG.SEMESTER_2.MAX_WEEKS;

    for (let weekNum = 1; weekNum <= maxWeeks; weekNum++) {
        const weekStart = new Date(semesterStart);
        weekStart.setDate(semesterStart.getDate() + (weekNum - 1) * 7);
        weekStart.setHours(12, 0, 0, 0); // Đảm bảo luôn là 12 trưa

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        weeks.push({
            value: weekNum,
            label: `Tuần ${weekNum.toString().padStart(2, '0')}`,
            dateRange: `[Từ ${formatDate(weekStart)} - Đến ${formatDate(weekEnd)}]`,
            fullLabel: `Tuần ${weekNum.toString().padStart(2, '0')} [Từ ${formatDate(weekStart)} - Đến ${formatDate(weekEnd)}]`,
            startDate: weekStart,
            endDate: weekEnd
        });
    }

    return weeks;
}

/**
 * Format date to Vietnamese format (DD/MM/YYYY)
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Get semester label in Vietnamese
 * @param {number} semester 
 * @returns {string}
 */
export function getSemesterLabel(semester) {
    switch (semester) {
        case 1:
            return 'Học kỳ 1';
        case 2:
            return 'Học kỳ 2';
        case 0:
            return 'Nghỉ hè';
        default:
            return 'Không xác định';
    }
}

/**
 * Check if a specific date falls within a semester
 * @param {Date} date 
 * @param {number} semester 
 * @param {number} academicYearStart 
 * @returns {boolean}
 */
export function isDateInSemester(date, semester, academicYearStart) {
    let semesterStart, semesterEnd;

    if (semester === 1) {
        semesterStart = new Date(academicYearStart, 8, 1); // Sept 1
        semesterEnd = new Date(academicYearStart, 11, 31); // Dec 31
    } else if (semester === 2) {
        semesterStart = new Date(academicYearStart + 1, 0, SEMESTER_CONFIG.SEMESTER_2.START_DAY);
        semesterEnd = new Date(academicYearStart + 1, 4, 31); // May 31
    } else {
        return false;
    }

    return date >= semesterStart && date <= semesterEnd;
}

/**
 * Get all semesters for dropdown (for a specific academic year)
 * @param {number} academicYearStart 
 * @returns {Array}
 */
export function getSemestersForYear(academicYearStart) {
    return [
        {
            value: 1,
            label: `Học kỳ 1 - Năm học ${academicYearStart}-${academicYearStart + 1}`,
            academicYear: academicYearStart,
            semester: 1
        },
        {
            value: 2,
            label: `Học kỳ 2 - Năm học ${academicYearStart}-${academicYearStart + 1}`,
            academicYear: academicYearStart,
            semester: 2
        }
    ];
}

/**
 * Generate all semester options for multiple years
 * @param {number} yearsBack 
 * @param {number} yearsForward 
 * @returns {Array}
 */
export function generateAllSemesterOptions(yearsBack = 2, yearsForward = 1) {
    const academicYears = generateAcademicYears(yearsBack, yearsForward);
    const allSemesters = [];

    academicYears.forEach(year => {
        const semesters = getSemestersForYear(year.value);
        allSemesters.push(...semesters);
    });

    return allSemesters;
}
