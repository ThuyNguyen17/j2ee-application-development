import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, LogOut } from "lucide-react";
import "./Profile.css";

const Profile = () =>{
    const [teacherInfo, setTeacherInfo] = useState({
        name: "",
        email: "",
        phone: "N/A",
        qualification: "Giảng viên"
    });
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFullName, setEditFullName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setTeacherInfo({
                name: user.fullName || "N/A",
                email: (user.username ? user.username + "@school.edu.vn" : "") || "N/A",
                phone: "N/A",
                qualification: "Giảng viên"
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchCurrentTeacher = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const loginUser = JSON.parse(storedUser);

                const response = await axios.get("http://localhost:8080/api/v1/teachers/getall");
                const teachers = response.data?.teachers || [];
                const found = teachers.find((t) => {
                    return (
                        (t.id && String(t.id) === String(loginUser.teacherId)) ||
                        (t.userId && String(t.userId) === String(loginUser.userId)) ||
                        (t.fullName && String(t.fullName) === String(loginUser.fullName))
                    );
                });
                if (!found) return;

                setCurrentTeacher(found);
                setTeacherInfo((prev) => ({
                    ...prev,
                    name: found.fullName || prev.name,
                    email: found.email || prev.email,
                    phone: found.phone || prev.phone
                }));
            } catch (error) {
                console.error("Fetch teacher profile error:", error);
            }
        };

        fetchCurrentTeacher();
    }, []);

    const handleStartEdit = () => {
        if (!currentTeacher) return;
        setEditFullName(currentTeacher.fullName || "");
        setEditEmail(currentTeacher.email || "");
        setEditPhone(currentTeacher.phone || "");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaving(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentTeacher?.id) return;

        try {
            setSaving(true);
            const payload = {
                ...currentTeacher,
                fullName: editFullName,
                email: editEmail,
                phone: editPhone
            };

            await axios.put(`http://localhost:8080/api/v1/teachers/${currentTeacher.id}`, payload);

            setTeacherInfo((prev) => ({
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
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error("Update teacher profile error:", error);
            alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message || ""));
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "GV";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return(
        <div className="teacher-profile-container">
            <div className="profile-simple">
                {/* Header */}
                <div className="profile-header-bar">
                    <div className="profile-avatar-small">
                        {getInitials(isEditing ? editFullName : teacherInfo.name)}
                    </div>
                    <div className="profile-title">
                        <h2>{isEditing ? editFullName || "Giáo viên" : teacherInfo.name}</h2>
                        <p>Giáo viên</p>
                    </div>
                </div>

                {/* Body */}
                <div className="profile-body">
                    {/* Info Section */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h3>Thông tin cá nhân</h3>
                            {!isEditing && (
                                <button className="edit-btn" onClick={handleStartEdit} disabled={!currentTeacher}>
                                    <Edit2 size={14} />
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="info-list">
                                <div className="info-line">
                                    <label>Họ và tên</label>
                                    <span>{teacherInfo.name}</span>
                                </div>
                                <div className="info-line">
                                    <label>Email</label>
                                    <span>{teacherInfo.email}</span>
                                </div>
                                <div className="info-line">
                                    <label>Số điện thoại</label>
                                    <span>{teacherInfo.phone || "Chưa cập nhật"}</span>
                                </div>
                                <div className="info-line">
                                    <label>Chức vụ</label>
                                    <span>{teacherInfo.qualification}</span>
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
    )
}

export default Profile;