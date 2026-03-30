import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Upload, 
  Download, 
  ChevronLeft, 
  Search,
  GraduationCap,
  BookOpen,
  Mail,
  Phone
} from "lucide-react";
import { getClassesByTeacher } from "../../api/classApi";
import { getStudentsInClass } from "../../api/classApi";
import "./TeacherStudents.css";

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user.teacherId || user.userId;

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getClassesByTeacher(teacherId);
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải danh sách lớp.");
    }
  };

  const fetchStudentsByClass = async (classId) => {
    setLoading(true);
    try {
      const data = await getStudentsInClass(classId);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Không thể tải danh sách sinh viên.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    fetchStudentsByClass(classItem.id);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setStudents([]);
    setSearchTerm("");
  };

  // Export Excel
  const handleExportExcel = () => {
    const headers = ["Mã HS", "Họ và tên", "Email", "Số điện thoại", "Ngày sinh"];
    const csvContent = [
      headers.join(","),
      ...students.map(s => 
        [s.studentCode, s.fullName, s.email, s.phone, s.dob].join(",")
      )
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DanhSach_${selectedClass.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Import Excel
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      // Parse CSV (bỏ qua header)
      const newStudents = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const parts = line.split(',');
          if (parts.length >= 2) {
            newStudents.push({
              id: Date.now() + i,
              studentCode: parts[0] || `HS${String(i).padStart(3, '0')}`,
              fullName: parts[1] || "Chưa có tên",
              email: parts[2] || "",
              phone: parts[3] || "",
              dob: parts[4] || ""
            });
          }
        }
      }
      
      setStudents([...students, ...newStudents]);
      alert(`Đã import ${newStudents.length} sinh viên!`);
    };
    reader.readAsText(file);
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // View: Danh sách lớp
  if (!selectedClass) {
    return (
      <div className="teacher-students-container">
        <div className="page-header">
          <h1 className="page-title">
            <Users size={28} />
            Danh sách lớp học
          </h1>
          <p className="page-subtitle">Chọn lớp để xem danh sách sinh viên</p>
        </div>

        <div className="classes-grid">
          {classes.map((classItem) => (
            <div 
              key={classItem.id} 
              className="class-card"
              onClick={() => handleClassClick(classItem)}
            >
              <div className="class-header">
                <div className="class-icon">
                  <GraduationCap size={24} />
                </div>
                <div className="class-info">
                  <h3 className="class-name">{classItem.name}</h3>
                  <span className="class-subject">{classItem.subject}</span>
                </div>
              </div>
              
              <div className="class-stats">
                <div className="stat">
                  <Users size={16} />
                  <span>{classItem.studentCount} sinh viên</span>
                </div>
                <div className="stat">
                  <BookOpen size={16} />
                  <span>Phòng {classItem.room}</span>
                </div>
              </div>

              <div className="class-action">
                <span>Xem danh sách</span>
                <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View: Danh sách sinh viên trong lớp
  return (
    <div className="teacher-students-container">
      <div className="page-header">
        <button className="back-button" onClick={handleBackToClasses}>
          <ChevronLeft size={20} />
          Quay lại danh sách lớp
        </button>
        
        <div className="header-content">
          <div>
            <h1 className="page-title">
              <Users size={28} />
              {selectedClass.name}
            </h1>
            <p className="page-subtitle">
              Môn: {selectedClass.subject} | Phòng: {selectedClass.room} | 
              Tổng: {students.length} sinh viên
            </p>
          </div>
          
          <div className="header-actions">
            <label className="import-btn">
              <Upload size={18} />
              Import Excel
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleImportExcel}
                style={{ display: 'none' }}
              />
            </label>
            <button className="export-btn" onClick={handleExportExcel}>
              <Download size={18} />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Đang tải danh sách...</div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã sinh viên</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày sinh</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td className="student-code">{student.studentCode}</td>
                  <td className="student-name">{student.fullName}</td>
                  <td>
                    <div className="contact-info">
                      <Mail size={14} />
                      {student.email}
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <Phone size={14} />
                      {student.phone}
                    </div>
                  </td>
                  <td>{student.dob}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="empty-state">
              Không tìm thấy sinh viên nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;