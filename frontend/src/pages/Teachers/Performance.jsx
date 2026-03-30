import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  GraduationCap,
  Search,
  ChevronLeft,
  Save,
  TrendingUp,
  Award,
  FileText,
  Plus,
  Trash
} from "lucide-react";
import axios from "axios";
import "./TeacherPerformance.css";

const TeacherPerformance = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [semester, setSemester] = useState(1);
  const [studentScores, setStudentScores] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user.teacherId || user.userId;

  const scoreTypes = [
    { value: 'ORAL', label: 'Miệng' },
    { value: 'QUIZ_15', label: '15 phút' },
    { value: 'ONE_PERIOD', label: '1 tiết' },
    { value: 'MIDTERM', label: 'Giữa kỳ' },
    { value: 'FINAL', label: 'Cuối kỳ' }
  ];

  useEffect(() => {
    fetchClasses();
    setCurrentTeacher(user);
  }, []);

  const fetchClasses = async () => {
    try {
      if (!teacherId) {
        setError("Không tìm thấy thông tin giáo viên. Vui lòng đăng nhập lại.");
        return;
      }
      
      // Fetch teaching assignments for this teacher
      const resp = await axios.get(`http://localhost:8080/api/v1/teaching-assignments/teacher/${teacherId}`);
      const assignments = resp.data || [];
      
      // Group by class
      const classMap = {};
      assignments.forEach(a => {
        if (!classMap[a.className]) {
          classMap[a.className] = {
            id: a.className,
            name: a.className,
            subject: a.subjectName,
            assignmentId: a.id,
            studentCount: 0
          };
        }
      });
      
      setClasses(Object.values(classMap));
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải danh sách lớp: " + (err.message || "Lỗi không xác định"));
    }
  };

  const fetchClassData = async (classItem) => {
    setLoading(true);
    setError(null);
    try {
      // Find assignment for this teacher + class
      const resp = await axios.get(`http://localhost:8080/api/v1/teaching-assignments/teacher/${teacherId}`);
      const assignment = resp.data.find(a => a.className === classItem.id);
      
      if (assignment) {
        setCurrentAssignment(assignment);
      }
      
      // Fetch students
      const studentsResp = await axios.get(`http://localhost:8080/api/students/class/${classItem.id}`);
      const studentsData = studentsResp.data || [];
      
      // Fetch scores for each student
      const scoresMap = {};
      for (const student of studentsData) {
        try {
          const scoresResp = await axios.get(`http://localhost:8080/api/scores/student/${student.studentId}`);
          scoresMap[student.studentId] = scoresResp.data || [];
        } catch (e) {
          scoresMap[student.studentId] = [];
        }
      }
      
      setStudents(studentsData);
      setStudentScores(scoresMap);
      
    } catch (err) {
      console.error("Error fetching class data:", err);
      setError("Không thể tải dữ liệu lớp: " + (err.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    fetchClassData(classItem);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setStudents([]);
    setSearchTerm("");
    setCurrentAssignment(null);
  };

  const getStudentScoreItems = (studentId) => {
    const scores = studentScores[studentId] || [];
    const relevantScore = scores.find(s => 
      s.teachingAssignmentId === currentAssignment?.id && 
      s.semester === parseInt(semester)
    );
    return relevantScore?.items || [];
  };

  const calculateAverage = (items) => {
    if (!items || items.length === 0) return "0.00";
    let totalWeight = 0;
    let weightedSum = 0;
    
    items.forEach(item => {
      if (item.value != null && item.weight != null) {
        weightedSum += item.value * item.weight;
        totalWeight += item.weight;
      }
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : "0.00";
  };

  const getRankColor = (score) => {
    if (score >= 8.5) return "excellent";
    if (score >= 7.0) return "good";
    if (score >= 5.0) return "average";
    return "poor";
  };

  const handleAddScoreItem = async (studentId) => {
    if (!currentAssignment) {
      alert("Không tìm thấy thông tin phân công giảng dạy");
      return;
    }

    const newItem = { type: 'ORAL', value: '', weight: 1, date: new Date().toISOString().split('T')[0] };
    const currentItems = getStudentScoreItems(studentId);
    const updatedItems = [...currentItems, newItem];
    
    // Update local state
    const updatedScores = { ...studentScores };
    const studentScoreArr = updatedScores[studentId] || [];
    const existingScoreIndex = studentScoreArr.findIndex(s => 
      s.teachingAssignmentId === currentAssignment?.id && 
      s.semester === parseInt(semester)
    );
    
    if (existingScoreIndex >= 0) {
      studentScoreArr[existingScoreIndex].items = updatedItems;
    } else {
      studentScoreArr.push({
        studentId,
        teachingAssignmentId: currentAssignment.id,
        semester: parseInt(semester),
        academicYearId: new Date().getFullYear().toString(),
        items: updatedItems
      });
    }
    
    setStudentScores(updatedScores);
  };

  const handleRemoveScoreItem = (studentId, index) => {
    const currentItems = getStudentScoreItems(studentId);
    const updatedItems = currentItems.filter((_, i) => i !== index);
    
    // Update local state only (don't save to DB yet)
    const updatedScores = { ...studentScores };
    const studentScoreArr = updatedScores[studentId] || [];
    const existingScoreIndex = studentScoreArr.findIndex(s => 
      s.teachingAssignmentId === currentAssignment?.id && 
      s.semester === parseInt(semester)
    );
    
    if (existingScoreIndex >= 0) {
      studentScoreArr[existingScoreIndex].items = updatedItems;
    }
    
    setStudentScores(updatedScores);
  };

  const handleScoreChange = async (studentId, index, field, value) => {
    const currentItems = getStudentScoreItems(studentId);
    const updatedItems = currentItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    
    // Update local state immediately for responsiveness
    const updatedScores = { ...studentScores };
    const studentScoreArr = updatedScores[studentId] || [];
    const existingScoreIndex = studentScoreArr.findIndex(s => 
      s.teachingAssignmentId === currentAssignment?.id && 
      s.semester === parseInt(semester)
    );
    
    if (existingScoreIndex >= 0) {
      studentScoreArr[existingScoreIndex].items = updatedItems;
    } else {
      studentScoreArr.push({
        studentId,
        teachingAssignmentId: currentAssignment.id,
        semester: parseInt(semester),
        academicYearId: new Date().getFullYear().toString(),
        items: updatedItems
      });
    }
    
    setStudentScores(updatedScores);
  };

  const saveStudentScores = async (studentId, items) => {
    if (!currentAssignment) return;
    
    try {
      const payload = {
        studentId,
        teachingAssignmentId: currentAssignment.id,
        semester: parseInt(semester),
        academicYearId: new Date().getFullYear().toString(),
        items: items.map(item => ({
          ...item,
          value: parseFloat(item.value) || 0,
          weight: parseFloat(item.weight) || 1
        }))
      };

      const existingScores = studentScores[studentId] || [];
      const existingScore = existingScores.find(s => 
        s.teachingAssignmentId === currentAssignment.id && 
        s.semester === parseInt(semester)
      );
      
      if (existingScore) {
        await axios.put(`http://localhost:8080/api/scores/${existingScore.id}`, payload);
      } else {
        await axios.post('http://localhost:8080/api/scores', payload);
      }

      // Refresh scores
      const scoresResp = await axios.get(`http://localhost:8080/api/scores/student/${studentId}`);
      setStudentScores(prev => ({
        ...prev,
        [studentId]: scoresResp.data || []
      }));
      
    } catch (err) {
      console.error("Error saving scores:", err);
      alert("Không thể lưu điểm: " + err.message);
    }
  };

  const handleSaveAllGrades = async () => {
    try {
      for (const student of students) {
        const items = getStudentScoreItems(student.studentId);
        if (items.length > 0) {
          await saveStudentScores(student.studentId, items);
        }
      }
      alert("Đã lưu điểm thành công!");
    } catch (err) {
      console.error("Error saving grades:", err);
      alert("Không thể lưu điểm. Vui lòng thử lại.");
    }
  };

  const filteredStudents = students.filter(s =>
    (s.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.studentCode?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // View: Danh sách lớp
  if (!selectedClass) {
    return (
      <div className="teacher-performance-container">
        <div className="page-header">
          <h1 className="page-title">
            <BookOpen size={28} />
            Nhập điểm học sinh
          </h1>
          <p className="page-subtitle">Chọn lớp để nhập điểm theo môn học</p>
        </div>

        {error && <div className="error-state">{error}</div>}

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
                  <span className="class-subject">Môn: {classItem.subject}</span>
                </div>
              </div>

              <div className="class-action">
                <span>Nhập điểm</span>
                <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View: Bảng điểm lớp
  return (
    <div className="teacher-performance-container">
      <div className="page-header">
        <button className="back-button" onClick={handleBackToClasses}>
          <ChevronLeft size={20} />
          Quay lại danh sách lớp
        </button>
        
        <div className="header-content">
          <div>
            <h1 className="page-title">
              <BookOpen size={28} />
              {selectedClass.name} - Nhập điểm
            </h1>
            <p className="page-subtitle">
              Môn: {selectedClass.subject} | Tổng: {students.length} học sinh
            </p>
          </div>
          
          <div className="header-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
              <label>Học kỳ:</label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value={1}>Học kỳ 1</option>
                <option value={2}>Học kỳ 2</option>
              </select>
            </div>
            <button className="save-btn" onClick={handleSaveAllGrades}>
              <Save size={18} />
              Lưu điểm
            </button>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Đang tải...</div>
      ) : (
        <div className="performance-table-container">
          <table className="performance-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã HS</th>
                <th>Họ và tên</th>
                <th>Các cột điểm</th>
                <th>Điểm TB</th>
                <th>Xếp loại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const scoreItems = getStudentScoreItems(student.studentId);
                const average = calculateAverage(scoreItems);
                
                return (
                  <tr key={student.studentId}>
                    <td>{index + 1}</td>
                    <td className="student-code">{student.studentCode}</td>
                    <td className="student-name">{student.fullName}</td>
                    
                    <td style={{ minWidth: '300px' }}>
                      {scoreItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                          <select
                            value={item.type}
                            onChange={(e) => handleScoreChange(student.studentId, i, 'type', e.target.value)}
                            style={{ padding: '4px', fontSize: '12px' }}
                          >
                            {scoreTypes.map(t => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={item.value}
                            onChange={(e) => handleScoreChange(student.studentId, i, 'value', e.target.value)}
                            style={{ width: '60px', padding: '4px' }}
                          />
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={item.weight}
                            onChange={(e) => handleScoreChange(student.studentId, i, 'weight', e.target.value)}
                            style={{ width: '55px', padding: '4px', textAlign: 'center' }}
                            title="Hệ số"
                          />
                          <button
                            onClick={() => handleRemoveScoreItem(student.studentId, i)}
                            style={{ padding: '4px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </td>
                    
                    <td className="average-score">{average}</td>
                    <td>
                      <span className={`rank-badge ${getRankColor(parseFloat(average))}`}>
                        {parseFloat(average) >= 8.5 ? "Giỏi" :
                         parseFloat(average) >= 7.0 ? "Khá" :
                         parseFloat(average) >= 5.0 ? "TB" : "Yếu"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAddScoreItem(student.studentId)}
                        style={{ padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}
                      >
                        <Plus size={14} /> Thêm
                      </button>
                      <button
                        onClick={() => saveStudentScores(student.studentId, getStudentScoreItems(student.studentId))}
                        style={{ padding: '6px 12px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Save size={14} /> Lưu
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="empty-state">
              Không tìm thấy học sinh nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherPerformance;
