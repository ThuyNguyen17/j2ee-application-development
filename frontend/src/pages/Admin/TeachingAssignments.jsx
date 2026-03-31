import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X,
  UserCheck,
  Award
} from "lucide-react";
import { BASE_URL } from "../../api/config";
import "./TeachingAssignments.css";

const TeachingAssignments = () => {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [form, setForm] = useState({ 
        teacherId: '', 
        className: '', 
        subjectName: '' 
    });
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [editForm, setEditForm] = useState({ 
        teacherId: '', 
        className: '', 
        subjectName: '' 
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [teachersRes, classesRes, assignmentsRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/v1/teachers/getall`),
                axios.get(`${BASE_URL}/api/v1/class/getall`),
                axios.get(`${BASE_URL}/api/v1/teaching-assignments/all`)
            ]);
            
            setTeachers(teachersRes.data.teachers || []);
            setClasses(classesRes.data.classes || []);
            setAssignments(assignmentsRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("Không thể tải danh sách dữ liệu. Vui lòng thử lại.");
            setLoading(false);
        }
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/v1/teaching-assignments`, form);
            setForm({ teacherId: '', className: '', subjectName: '' });
            fetchInitialData();
            alert('Đã phân công giảng dạy thành công!');
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Lỗi khi phân công giảng dạy.');
        }
    };

    const handleUpdateAssignment = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/v1/teaching-assignments/${editingAssignment}`, editForm);
            setEditingAssignment(null);
            fetchInitialData();
            alert('Cập nhật phân công thành công!');
        } catch (error) {
            console.error('Error updating assignment:', error);
            alert('Lỗi khi cập nhật phân công.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phân công này?')) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/teaching-assignments/${id}`);
                fetchInitialData();
            } catch (error) {
                console.error('Error deleting assignment:', error);
                alert("Lỗi khi xóa phân công.");
            }
        }
    };

    const startEdit = (asgn) => {
        setEditingAssignment(asgn.id);
        setEditForm({
            teacherId: asgn.teacherId,
            className: asgn.className,
            subjectName: asgn.subjectName
        });
    };

    const filteredAssignments = assignments.filter(asgn => {
        const teacher = teachers.find(t => t.id === asgn.teacherId);
        const search = searchTerm.toLowerCase();
        return (
            (teacher && teacher.fullName.toLowerCase().includes(search)) ||
            asgn.subjectName.toLowerCase().includes(search) ||
            asgn.className.toLowerCase().includes(search)
        );
    });

    return (
        <div className="admin-teaching-page">
            <div className="page-header">
                <h1><UserCheck size={32} color="#0ea5e9" /> Phân công giảng dạy</h1>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Tổng cộng: {assignments.length} phân công
                </div>
            </div>

            {/* Form Section */}
            <div className="assignment-form-card">
              <h2>Tạo phân công mới</h2>
              <form onSubmit={handleAddAssignment}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Giảng viên</label>
                    <select 
                      className="form-control"
                      value={form.teacherId}
                      onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                      required
                    >
                      <option value="">Chọn giảng viên...</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.fullName} ({t.teacherCode})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lớp học</label>
                    <select 
                      className="form-control"
                      value={form.className}
                      onChange={(e) => setForm({ ...form, className: e.target.value })}
                      required
                    >
                      <option value="">Chọn lớp học...</option>
                      {classes.map(c => (
                        <option key={c.id} value={`${c.gradeLevel}${c.className}`}>
                          {c.gradeLevel}{c.className}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Môn học</label>
                    <input 
                      className="form-control"
                      placeholder="VD: Toán học, Vật lý..."
                      value={form.subjectName}
                      onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  <Plus size={18} /> Phân công ngay
                </button>
              </form>
            </div>

            {/* Search and Table Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Danh sách đã phân công
              </h2>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Tìm kiếm giảng viên, môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="assignments-table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Giảng viên</th>
                      <th>Lớp học</th>
                      <th>Môn học</th>
                      <th style={{ textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="spinner" />
                            <span>Đang tải danh sách...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAssignments.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                            <Award size={48} />
                            <span>Chưa có phân công nào.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAssignments.map((asgn) => {
                        const teacher = teachers.find(t => t.id === asgn.teacherId);
                        return (
                          <tr key={asgn.id}>
                            <td>
                              <div className="teacher-cell">
                                <div className="teacher-avatar">
                                  {teacher ? teacher.fullName.charAt(0) : 'T'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600' }}>{teacher ? teacher.fullName : 'N/A'}</div>
                                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{teacher?.teacherCode || 'No Code'}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="class-badge">{asgn.className}</span></td>
                            <td><span className="subject-badge">{asgn.subjectName}</span></td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="action-btn edit-btn" onClick={() => startEdit(asgn)}><Edit3 size={20} /></button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(asgn.id)}><Trash2 size={20} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Modal */}
            {editingAssignment && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Chỉnh sửa phân công</h2>
                    <button onClick={() => setEditingAssignment(null)} className="action-btn" style={{ border: 'none' }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleUpdateAssignment}>
                    <div className="form-group">
                      <label>Giảng viên</label>
                      <select 
                        className="form-control"
                        value={editForm.teacherId}
                        onChange={(e) => setEditForm({ ...editForm, teacherId: e.target.value })}
                        required
                      >
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.fullName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Lớp học</label>
                      <select 
                        className="form-control"
                        value={editForm.className}
                        onChange={(e) => setEditForm({ ...editForm, className: e.target.value })}
                        required
                      >
                        {classes.map(c => (
                          <option key={c.id} value={`${c.gradeLevel}${c.className}`}>{c.gradeLevel}{c.className}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Môn học</label>
                      <input 
                        className="form-control"
                        value={editForm.subjectName}
                        onChange={(e) => setEditForm({ ...editForm, subjectName: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button type="submit" className="submit-btn" style={{ flex: 1, justifyContent: 'center' }}>Cập nhật</button>
                      <button type="button" className="action-btn" style={{ flex: 1, height: '44px' }} onClick={() => setEditingAssignment(null)}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>
    );
};

export default TeachingAssignments;
