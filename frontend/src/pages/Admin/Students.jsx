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
import { getAllClasses, getStudentsInClass, importStudentsToClass, exportStudentsFromClass } from "../../api/classApi";
import "./Students.css";

const AdminStudents = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setClassesLoading(true);
    try {
      const data = await getAllClasses();
      // Format classes giống như getClassesByTeacher
      const formattedClasses = data.map(c => {
        const className = c.gradeLevel + c.className;
        return {
          ...c,
          name: className,
          className: className,
          subject: c.subject || 'Chưa có môn',
          room: c.room || 'L2-01',
          studentCount: c.studentCount || 0
        };
      });
      setClasses(formattedClasses);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải danh sách lớp.");
    } finally {
      setClassesLoading(false);
    }
  };

  const fetchStudentsByClass = async (classItem) => {
    setStudentsLoading(true);
    try {
      const data = await getStudentsInClass(classItem.name || classItem.className);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Không thể tải danh sách sinh viên.");
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    fetchStudentsByClass(classItem);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setStudents([]);
    setSearchTerm("");
  };

  // Export Excel - call backend API
  const handleExportExcel = async () => {
    setExportLoading(true);
    try {
      const blob = await exportStudentsFromClass(selectedClass.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `DanhSach_${selectedClass.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting students:", err);
      alert("Lỗi khi export: " + (err.response?.data?.message || err.message));
    } finally {
      setExportLoading(false);
    }
  };

  // Import Excel - call backend API with classId
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validTypes.includes(fileExt)) {
      alert("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV (.csv)");
      return;
    }

    setImportLoading(true);
    try {
      await importStudentsToClass(selectedClass.id, file);
      alert(`Import thành công! Danh sách sinh viên đã được thêm vào lớp ${selectedClass.name}`);
      // Refresh danh sách sinh viên sau khi import
      await fetchStudentsByClass(selectedClass);
    } catch (err) {
      console.error("Error importing students:", err);
      alert("Lỗi khi import: " + (err.response?.data?.message || err.message));
    } finally {
      setImportLoading(false);
      // Reset file input
      e.target.value = '';
    }
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

      {classesLoading ? (
        <div className="loading-state">Đang tải danh sách lớp...</div>
      ) : classes.length === 0 ? (
        <div className="empty-state">Không có lớp học nào</div>
      ) : (
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
                </div>
              </div>
              
              <div className="class-stats">
                <div className="stat">
                  <Users size={16} />
                  <span>{classItem.studentCount} sinh viên</span>
                </div>
              </div>

              <div className="class-action">
                <span>Xem danh sách</span>
                <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>
          ))}
        </div>
      )}
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
              Tổng: {students.length} sinh viên
            </p>
          </div>
          
          <div className="header-actions">
            <label className={`import-btn ${importLoading ? 'loading' : ''}`}>
              <Upload size={18} />
              {importLoading ? 'Đang import...' : 'Import Excel'}
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleImportExcel}
                disabled={importLoading}
                style={{ display: 'none' }}
              />
            </label>
            <button className={`export-btn ${exportLoading ? 'loading' : ''}`} onClick={handleExportExcel} disabled={exportLoading}>
              <Download size={18} />
              {exportLoading ? 'Đang export...' : 'Export Excel'}
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

      {studentsLoading ? (
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
                <th>Địa chỉ</th>
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
                      {student.email || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <Phone size={14} />
                      {student.phone || 'N/A'}
                    </div>
                  </td>
                  <td>{student.dob || 'N/A'}</td>
                  <td>{student.address || 'Chưa có'}</td>
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

export default AdminStudents;