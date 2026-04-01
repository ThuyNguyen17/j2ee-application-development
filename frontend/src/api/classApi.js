import axios from 'axios';
import { BASE_URL, API_BASE_URL } from './config';

// ===== CLASS APIs =====

// Get all classes
export const getAllClasses = async () => {
    const response = await axios.get(`${API_BASE_URL}/class/getall`);
    return response.data.classes || [];
};

// Get class by ID
export const getClassById = async (id) => {
    const response = await axios.get(`${BASE_URL}/api/classes/${id}`);
    return response.data;
};

// Create new class
export const createClass = async (classData) => {
    const response = await axios.post(`${API_BASE_URL}/class`, classData);
    return response.data;
};

// Update class
export const updateClass = async (id, classData) => {
    const response = await axios.put(`${API_BASE_URL}/class/${id}`, classData);
    return response.data;
};

// Delete class
export const deleteClass = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/class/${id}`);
    return response.data;
};

// Get classes by teacher ID - sử dụng teaching-assignments
export const getClassesByTeacher = async (teacherId) => {
    try {
        // Lấy teaching assignments của giáo viên
        const response = await axios.get(`${API_BASE_URL}/teaching-assignments/teacher/${teacherId}`);
        const assignments = response.data || [];
        
        // Trích xuất danh sách lớp từ assignments (dùng classId thay vì className sau refactor)
        const classIds = [...new Set(assignments.map(a => a.classId).filter(id => id))];
        
        // Lấy tất cả classes và filter theo className
        const allClassesResponse = await axios.get(`${API_BASE_URL}/class/getall`);
        const allClasses = allClassesResponse.data.classes || [];
        
        // Map classId với class objects
        const teacherClasses = classIds.map(classId => {
            // Tìm class object từ allClasses
            const classObj = allClasses.find(c => c.id === classId);
            
            const assignment = assignments.find(a => a.classId === classId);
            
            // Nếu tìm thấy class object, bổ sung thêm thông tin
            if (classObj) {
                const className = classObj.gradeLevel + classObj.className;
                return {
                    ...classObj,
                    id: classObj.id || classId,
                    name: className,
                    className: className,
                    subject: assignment?.subjectName || 'Chưa có môn',
                    room: classObj.room || 'L2-01',
                    studentCount: classObj.studentCount || 30
                };
            }
            
            // Nếu không tìm thấy, tạo object mới
            return {
                id: classId,
                name: classId,
                className: classId,
                subject: assignment?.subjectName || 'Chưa có môn',
                room: 'L2-01',
                studentCount: 30
            };
        });
        
        return teacherClasses;
    } catch (err) {
        console.error("Error fetching teacher classes:", err);
        return [];
    }
};

// ===== STUDENT APIs =====

// Get all students
export const getAllStudents = async () => {
    const response = await axios.get(`${BASE_URL}/api/students`);
    return response.data || [];
};

// Get student by ID
export const getStudentById = async (id) => {
    const response = await axios.get(`${BASE_URL}/api/students/${id}`);
    return response.data;
};

// Get students in class - sử dụng endpoint getStudentsByClass mới
export const getStudentsInClass = async (classIdOrName) => {
    try {
        // Nếu là ID (ObjectId 24 ký tự), thì gọi theo ID hoặc label tương ứng
        // Nhưng endpoint getStudentsByClass hỗ trợ cả className (label)
        // Trong UI, classItem.name hoặc classItem.className thường là label (10A1)
        const response = await axios.get(`${BASE_URL}/api/students/class/${encodeURIComponent(classIdOrName)}`);
        return response.data || [];
    } catch (err) {
        console.error("Error fetching students in class:", err);
        return [];
    }
};

// Import students to class
export const importStudentsToClass = async (classId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    
    const response = await axios.post(`${BASE_URL}/api/students/import-with-class`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Export students from class
export const exportStudentsFromClass = async (classId) => {
    const response = await axios.get(`${BASE_URL}/api/students/export`, {
        responseType: 'blob'
    });
    return response.data;
};

// ===== TEACHER APIs =====

// Get all teachers
export const getAllTeachers = async () => {
    const response = await axios.get(`${API_BASE_URL}/teachers/getall`);
    return response.data.teachers || [];
};

// Get teacher by ID
export const getTeacherById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/teachers/${id}`);
    return response.data;
};
