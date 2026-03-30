import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImportExportUI.css'; // Assuming we move the CSS too

const ImportExportUI = () => {
  const [students, setStudents] = useState([]);
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8080/api/students';

  const loadStudents = async () => {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi load danh sách:', error);
    }
  };

  useEffect(() => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'LECTURER') {
      navigate('/student/login'); // Or appropriate login page
      return;
    }
    loadStudents();
  }, [navigate]);

  const handleImport = async () => {
    if (!file) {
      alert('Vui lòng chọn file Excel!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('address', address);

    try {
      setStatusMessage('Đang xử lý...');
      const response = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setStatusMessage('Import thành công!');
        setAddress('');
        setFile(null);
        loadStudents();
      } else {
        setStatusMessage('Import thất bại!');
      }
    } catch (error) {
      setStatusMessage('Lỗi kết nối!');
    }
  };

  const handleExport = () => {
    window.location.href = `${API_BASE}/export`;
  };

  return (
    <div className="container">
      <div className="header-title">
        ☰ Quản Lý Sinh Viên
      </div>

      <div className="controls">
        <div className="input-group">
          <label htmlFor="studentAddress">Địa chỉ học sinh</label>
          <input
            type="text"
            id="studentAddress"
            placeholder="Nhập địa chỉ cụ thể..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>File Excel</label>
          <label className="btn btn-import" htmlFor="fileInput">Chọn file</label>
          <input
            type="file"
            id="fileInput"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button className="btn" onClick={handleImport}>Import</button>
        <button className="btn" onClick={handleExport} style={{ backgroundColor: '#8e44ad' }}>Export</button>

        <span className="status">{statusMessage}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã DV</th>
            <th>Mã HS / Họ Tên</th>
            <th>Giáo viên</th>
            <th>Địa Chỉ</th>
            <th>Buổi</th>
            <th>Điểm danh</th>
            <th>BTVN</th>
            <th>NX của GV</th>
            <th>Ngày</th>
            <th>Ghi chú</th>
            <th>Owner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((item, index) => (
            <tr key={index}>
              <td>{item.maDV || 'CT237'}</td>
              <td>{item.studentCode || ''} - {item.fullName || ''}</td>
              <td>{item.teacherName || 'TEACHER KEITH'}</td>
              <td>{item.contact?.address || 'Chưa cập nhật'}</td>
              <td>{item.lessonCount || '2.00'}</td>
              <td className="text-blue">Có</td>
              <td className="text-blue">Làm đầy đủ</td>
              <td className="text-italic-red">Empty</td>
              <td>{item.date || '04-05-2017'}</td>
              <td className="text-italic-red">Empty</td>
              <td>Admin</td>
              <td className="delete-icon">✖</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportExportUI;