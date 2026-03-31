import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/studentApi";
import { normalizeClassName } from "../utils/classNameUtils";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError("");

    try {
      const user = await login(username, password);
      const normalizedRole = user?.role === "LECTURER" ? "TEACHER" : user?.role;
      const normalizedUser =
        normalizedRole === "STUDENT"
          ? { ...user, role: normalizedRole, className: normalizeClassName(user.className) }
          : { ...user, role: normalizedRole };

      localStorage.setItem("user", JSON.stringify(normalizedUser));

      if (normalizedUser.role === "STUDENT") navigate("/student/dashboard");
      else if (normalizedUser.role === "TEACHER") navigate("/teacher/dashboard");
      else if (normalizedUser.role === "ADMIN") navigate("/admin/dashboard");
      else setError("Tài khoản không có quyền truy cập");
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      const errorMsg = err.response?.data?.message 
        || err.message 
        || "Tài khoản hoặc mật khẩu không đúng";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>S-Attendance</h1>
          <p>Đăng nhập (Student / Teacher / Admin)</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản"
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-footer">
          <p>Chọn đúng tài khoản theo role của bạn, hệ thống sẽ tự điều hướng.</p>
        </div>
      </div>
    </div>
  );
}

