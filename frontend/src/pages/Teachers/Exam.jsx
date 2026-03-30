import React, { useState, useEffect } from "react";
import { 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  GraduationCap,
  CheckCircle,
  X,
  Search,
  Clock
} from "lucide-react";
import { 
  getAllExams, 
  createExam, 
  updateExam, 
  deleteExam 
} from "../../api/examApi";
import { getClassesByTeacher } from "../../api/classApi";
import "./TeacherExams.css";

const TeacherExams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    examDate: "",
    duration: 60,
    selectedClasses: [],
    maxScore: 10
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user.teacherId || user.userId;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!teacherId) {
        console.error("Teacher ID is missing from localStorage");
        setError("Không tìm thấy thông tin giáo viên. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }
      
      console.log("Fetching exams for teacher:", teacherId);
      const [examsData, classesData] = await Promise.all([
        getAllExams(),
        getClassesByTeacher(teacherId)
      ]);
      console.log("Exams loaded:", examsData);
      console.log("Classes loaded:", classesData);
      setExams(examsData || []);
      setClasses(classesData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Không thể tải dữ liệu: " + (err.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (formData.selectedClasses.length === 0) {
      alert("Vui lòng chọn ít nhất một lớp!");
      return;
    }
    try {
      const selectedClassObjects = classes.filter(c => 
        formData.selectedClasses.includes(c.id)
      );
      const examData = {
        ...formData,
        classes: selectedClassObjects,
        teacherId,
        completedCount: 0,
        totalCount: selectedClassObjects.reduce((sum, c) => sum + (c.studentCount || 30), 0)
      };
      await createExam(examData);
      setShowCreateModal(false);
      resetForm();
      alert("Bài thi đã được tạo và gửi đến các lớp đã chọn!");
      fetchData();
    } catch (err) {
      console.error("Error creating exam:", err);
      alert("Không thể tạo bài thi. Vui lòng thử lại.");
    }
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    try {
      const selectedClassObjects = classes.filter(c => 
        formData.selectedClasses.includes(c.id)
      );
      const examData = {
        ...formData,
        classes: selectedClassObjects
      };
      await updateExam(editingExam.id, examData);
      setEditingExam(null);
      setShowCreateModal(false);
      resetForm();
      alert("Bài thi đã được cập nhật!");
      fetchData();
    } catch (err) {
      console.error("Error updating exam:", err);
      alert("Không thể cập nhật bài thi. Vui lòng thử lại.");
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài thi này?")) {
      try {
        await deleteExam(id);
        alert("Đã xóa bài thi!");
        fetchData();
      } catch (err) {
        console.error("Error deleting exam:", err);
        alert("Không thể xóa bài thi. Vui lòng thử lại.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      examDate: "",
      duration: 60,
      selectedClasses: [],
      maxScore: 10
    });
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title || '',
      description: exam.description || '',
      examDate: exam.examDate || '',
      duration: exam.duration || 60,
      selectedClasses: (exam.classes || []).map(c => c.id || c),
      maxScore: exam.maxScore || 10
    });
    setShowCreateModal(true);
  };

  const toggleClassSelection = (classId) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter(id => id !== classId)
        : [...prev.selectedClasses, classId]
    }));
  };

  const filteredExams = exams.filter(ex =>
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (completed, total) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 80) return "success";
    if (percentage >= 50) return "warning";
    return "danger";
  };

  if (loading) {
    return (
      <div className="teacher-exams-container">
        <div className="page-header">
          <h1 className="page-title">
            <Award size={28} />
            Quản lý bài thi
          </h1>
        </div>
        <div className="loading-state">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-exams-container">
        <div className="page-header">
          <h1 className="page-title">
            <Award size={28} />
            Quản lý bài thi
          </h1>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="teacher-exams-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Award size={28} />
            Quản lý bài thi
          </h1>
          <p className="page-subtitle">Tạo và gửi bài thi đến các lớp</p>
        </div>
        <button 
          className="create-btn"
          onClick={() => {
            setEditingExam(null);
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus size={20} />
          Tạo bài thi mới
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bài thi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="exams-list">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <div className="exam-header">
              <div className="exam-info">
                <h3 className="exam-title">{exam.title}</h3>
                <p className="exam-desc">{exam.description}</p>
              </div>
              <div className="exam-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => openEditModal(exam)}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteExam(exam.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="exam-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>Ngày thi: {exam.examDate}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>Thời gian: {exam.duration} phút</span>
              </div>
              <div className="meta-item">
                <GraduationCap size={16} />
                <span>Điểm tối đa: {exam.maxScore}</span>
              </div>
            </div>

            <div className="exam-classes">
              <span className="label">Gửi đến:</span>
              <div className="class-tags">
                {(exam.classes || []).map(c => (
                  <span key={c.id || c} className="class-tag">{c.name || c}</span>
                ))}
              </div>
            </div>

            <div className={`exam-status ${getStatusColor(exam.completedCount || 0, exam.totalCount || 1)}`}>
              <CheckCircle size={16} />
              <span>{exam.completedCount || 0}/{exam.totalCount || 0} sinh viên đã hoàn thành</span>
            </div>
          </div>
        ))}

        {filteredExams.length === 0 && (
          <div className="empty-state">
            <Award size={48} />
            <p>Chưa có bài thi nào</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingExam ? "Chỉnh sửa bài thi" : "Tạo bài thi mới"}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingExam(null);
                  resetForm();
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={editingExam ? handleUpdateExam : handleCreateExam}>
              <div className="form-group">
                <label>Tiêu đề bài thi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nhập tiêu đề bài thi"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả chi tiết bài thi"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày thi *</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thời gian (phút) *</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Điểm tối đa *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({...formData, maxScore: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Chọn lớp gửi bài thi *</label>
                <div className="class-selection">
                  {classes.map(c => (
                    <label key={c.id} className="class-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.selectedClasses.includes(c.id)}
                        onChange={() => toggleClassSelection(c.id)}
                      />
                      <span className="checkmark"></span>
                      <span className="class-name">{c.name}</span>
                    </label>
                  ))}
                </div>
                {formData.selectedClasses.length === 0 && (
                  <p className="error-text">Vui lòng chọn ít nhất một lớp</p>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingExam(null);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={formData.selectedClasses.length === 0}
                >
                  {editingExam ? "Cập nhật" : "Tạo bài thi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExams;
