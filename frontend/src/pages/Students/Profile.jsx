import React, { useState, useEffect } from "react";
import { User, Mail, Phone, School, Hash, BookOpen, LogOut, Edit2, Save, X, Camera } from "lucide-react";
import axios from "axios";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [studentProfile, setStudentProfile] = useState({
    name: "",
    studentCode: "",
    grade: "",
    school: "Trường THPT Chuyên ABC",
    email: "",
    phone: "N/A"
  });
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setStudentProfile({
        name: user.fullName || "N/A",
        studentCode: user.studentCode || "N/A",
        grade: user.className || "N/A",
        school: "Trường THPT Chuyên ABC",
        email: (user.username ? user.username + "@student.edu.vn" : "") || "N/A",
        phone: "N/A"
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const loginUser = JSON.parse(storedUser);
      const idOrCode = loginUser.studentId || loginUser.studentCode || loginUser.userId;
      if (!idOrCode) return;

      try {
        const response = await axios.get(`http://192.168.101.178:8080/api/students/${encodeURIComponent(idOrCode)}`);
        const found = response.data;
        if (found) {
          setCurrentStudent(found);
          setStudentProfile((prev) => ({
            ...prev,
            name: found.fullName || prev.name,
            studentCode: found.studentCode || prev.studentCode,
            email: found.contact?.email || prev.email,
            phone: found.contact?.phone || prev.phone
          }));
          return;
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Fetch student profile error:", error);
        }
      }

      try {
        const listResponse = await axios.get('http://192.168.101.178:8080/api/students');
        const allStudents = listResponse.data || [];
        const foundByStudent = allStudents.find((student) =>
          student.studentCode === loginUser.studentCode ||
          student.id === loginUser.studentId
        );
        if (foundByStudent) {
          setCurrentStudent(foundByStudent);
          setStudentProfile((prev) => ({
            ...prev,
            name: foundByStudent.fullName || prev.name,
            studentCode: foundByStudent.studentCode || prev.studentCode,
            email: foundByStudent.contact?.email || prev.email,
            phone: foundByStudent.contact?.phone || prev.phone
          }));
        }
      } catch (listError) {
        console.error("Fallback fetch student profile error:", listError);
      }
    };

    fetchCurrentStudent();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleStartEdit = () => {
    if (!currentStudent) {
      alert("Chưa tải được thông tin học sinh, vui lòng thử lại sau.");
      return;
    }
    setEditFullName(currentStudent.fullName || "");
    setEditEmail(currentStudent.contact?.email || "");
    setEditPhone(currentStudent.contact?.phone || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaving(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const idToUpdate = currentStudent?.id || currentStudent?._id;
    if (!idToUpdate) {
      alert("Lỗi: Không tìm thấy ID học sinh để cập nhật.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...currentStudent,
        fullName: editFullName,
        contact: {
          ...(currentStudent.contact || {}),
          email: editEmail,
          phone: editPhone
        }
      };

      await axios.put(`http://192.168.101.178:8080/api/students/${idToUpdate}`, payload);

      setStudentProfile((prev) => ({
        ...prev,
        name: editFullName,
        email: editEmail,
        phone: editPhone
      }));

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.fullName = editFullName;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      setIsEditing(false);
      alert("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Update student profile error:", error);
      const errMsg = error.response?.data?.message || error.message || "Unknown error";
      alert("Cập nhật profile thất bại: " + errMsg);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "S";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="student-profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-container">
      <div className="profile-simple">
        {/* Header */}
        <div className="profile-header-bar">
          <div className="profile-avatar-small">
            {getInitials(isEditing ? editFullName : studentProfile.name)}
          </div>
          <div className="profile-title">
            <h2>{isEditing ? editFullName || "Học sinh" : studentProfile.name}</h2>
            <p>Học sinh • {studentProfile.grade}</p>
          </div>
        </div>

        {/* Body */}
        <div className="profile-body">
          {/* Info Section */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Thông tin cá nhân</h3>
              {!isEditing && (
                <button className="edit-btn" onClick={handleStartEdit}>
                  <Edit2 size={14} />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="info-list">
                <div className="info-line">
                  <label>Mã học sinh</label>
                  <span>{studentProfile.studentCode}</span>
                </div>
                <div className="info-line">
                  <label>Lớp</label>
                  <span>{studentProfile.grade}</span>
                </div>
                <div className="info-line">
                  <label>Trường</label>
                  <span>{studentProfile.school}</span>
                </div>
                <div className="info-line">
                  <label>Email</label>
                  <span>{studentProfile.email}</span>
                </div>
                <div className="info-line">
                  <label>Số điện thoại</label>
                  <span>{studentProfile.phone || "Chưa cập nhật"}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="edit-form">
                <div className="form-field">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Nhập email"
                  />
                </div>
                <div className="form-field">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="form-btns">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Logout Section */}
          <div className="logout-section">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;