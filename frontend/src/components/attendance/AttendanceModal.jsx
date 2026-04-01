import React, { useEffect, useState, useRef, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  startSession,
  updateQrToken,
  getAttendances,
  closeSession,
  updateAttendanceNote,
  clearAttendances,
} from "../../api/attendanceApi";
import { getStudentsByClass } from "../../api/studentApi";
import { normalizeClassName } from "../../utils/classNameUtils";
import "./AttendanceModal.css";

const AttendanceModal = ({
  isOpen,
  onClose,
  assignmentId,
  date,
  period,
  semester,
  className,
}) => {
  // ================= STATE =================

  const [sessionId, setSessionId] = useState(null);
  const [currentQrToken, setCurrentQrToken] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("attended");
  const [loading, setLoading] = useState(false);

  // 📌 Ref để quản lý interval (tránh memory leak)
  const qrIntervalRef = useRef(null);
  const attendanceIntervalRef = useRef(null);

  // ================= VALIDATION =================

  // ❗ Nếu thiếu dữ liệu quan trọng → không render
  if (!isOpen || !assignmentId || !date || !period) return null;

  // ================= INIT SESSION =================

  useEffect(() => {
    if (!isOpen) return;

    const initSession = async () => {
      try {
        setLoading(true);

        // 🚀 Tạo session điểm danh
        const session = await startSession(
          assignmentId,
          date,
          period,
          semester
        );

        setSessionId(session.id);

        // 🔐 Tạo token đầu tiên
        await updateToken(session.id);
      } catch (error) {
        console.error("Start session error:", error);
        alert("Không thể tạo session điểm danh!");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 🧹 Cleanup khi đóng modal
    return () => {
      clearInterval(qrIntervalRef.current);
      clearInterval(attendanceIntervalRef.current);
      setSessionId(null);
      setAttendances([]);
    };
  }, [isOpen]);

  // ================= QR TOKEN =================

  /**
   * 📌 Tạo token mới (chống gian lận)
   */
  const updateToken = async (sId) => {
    if (!sId) return;

    const newToken = `${sId}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    try {
      await updateQrToken(sId, newToken);

      // ✅ chỉ update UI khi backend thành công
      setCurrentQrToken(newToken);
    } catch (err) {
      console.error("Update token error:", err);
    }
  };

  /**
   * 🔁 Refresh QR mỗi 20s
   */
  useEffect(() => {
    if (!sessionId) return;

    qrIntervalRef.current = setInterval(() => {
      updateToken(sessionId);
    }, 20000);

    return () => clearInterval(qrIntervalRef.current);
  }, [sessionId]);

  // ================= ATTENDANCE POLLING =================

  /**
   * 🔄 Lấy danh sách điểm danh mỗi 3s
   */
  useEffect(() => {
    if (!sessionId) return;

    const fetchAttendances = async () => {
      try {
        const data = await getAttendances(sessionId);
        setAttendances(data || []);
      } catch (err) {
        console.error("Fetch attendance error:", err);
      }
    };

    attendanceIntervalRef.current = setInterval(fetchAttendances, 3000);

    return () => clearInterval(attendanceIntervalRef.current);
  }, [sessionId]);

  // ================= STUDENT LIST =================

  const normalizedClassName = normalizeClassName(className || "");

  /**
   * 📌 Lấy danh sách toàn bộ học sinh trong lớp
   */
  useEffect(() => {
    if (!normalizedClassName) {
      console.log("[AttendanceModal] normalizedClassName is empty, skipping fetch");
      return;
    }

    const fetchStudents = async () => {
      try {
        console.log("[AttendanceModal] Fetching students for class:", normalizedClassName);
        const students = await getStudentsByClass(normalizedClassName);
        console.log("[AttendanceModal] Got students:", students);
        setAllStudents(students || []);
      } catch (err) {
        console.error("[AttendanceModal] Fetch students error:", err);
      }
    };

    fetchStudents();
  }, [normalizedClassName]);

  // ================= COMPUTED DATA =================

  /**
   * 📌 Tối ưu: dùng Set để check nhanh O(1)
   */
  const attendedStudentIds = useMemo(() => {
    return new Set(attendances.map((a) => a.studentId));
  }, [attendances]);

  /**
   * 📌 Danh sách chưa điểm danh
   */
  const unattendedStudents = useMemo(() => {
    return allStudents.filter(
      (s) => !attendedStudentIds.has(s.studentId)
    );
  }, [allStudents, attendedStudentIds]);

  // ================= HANDLERS =================

  /**
   * ✏️ Update note
   */
  const handleNoteChange = async (attendanceId, newNote) => {
    try {
      await updateAttendanceNote(attendanceId, newNote);

      setAttendances((prev) =>
        prev.map((a) =>
          a.id === attendanceId ? { ...a, note: newNote } : a
        )
      );
    } catch (err) {
      console.error("Update note error:", err);
    }
  };

  /**
   * 💾 Save + đóng session
   */
  const handleSave = async () => {
    try {
      if (sessionId) {
        await closeSession(sessionId);
      }
      onClose();
    } catch (err) {
      console.error("Close session error:", err);
    }
  };

  // ================= QR URL =================

  const studentUrl = `${window.location.origin}/attendance?sessionId=${sessionId}&token=${currentQrToken}`;

  // ================= UTIL =================

  /**
   * 🕒 Format time chuẩn - xử lý LocalTime từ backend
   */
  const formatTime = (timeValue) => {
    if (!timeValue) return "--:--:--";
    
    // Nếu là object {hour, minute, second} từ backend
    if (typeof timeValue === 'object') {
      const h = timeValue.hour?.toString().padStart(2, '0') || '00';
      const m = timeValue.minute?.toString().padStart(2, '0') || '00';
      const s = timeValue.second?.toString().padStart(2, '0') || '00';
      return `${h}:${m}:${s}`;
    }
    
    // Nếu là string dạng "HH:MM:SS" (LocalTime ISO format)
    if (typeof timeValue === 'string') {
      // Nếu đã đúng format HH:MM:SS, trả về luôn
      if (/^\d{2}:\d{2}:\d{2}$/.test(timeValue)) {
        return timeValue;
      }
      // Nếu là ISO datetime string, lấy phần time
      try {
        const date = new Date(timeValue);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString('vi-VN', { hour12: false });
        }
      } catch (e) {
        // fall through
      }
    }
    
    return String(timeValue);
  };

  // ================= RENDER TABLE =================

  const renderTable = (students, isAttended = true) => {
    if (isAttended) {
      return (
        <>
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Thời gian</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5">Chưa có ai điểm danh</td>
              </tr>
            ) : (
              students.map((a) => {
                const isSafe =
                  a.location &&
                  !a.location.toLowerCase().includes("denied");

                return (
                  <tr key={a.id}>
                    <td>{a.studentName}</td>
                    <td>{formatTime(a.checkInTime)}</td>
                    <td>{a.location || "-"}</td>
                    <td>
                      {isSafe ? "✅ Hợp lệ" : "⚠️ Cảnh báo"}
                    </td>
                    <td>
                      <input
                        value={a.note || ""}
                        onChange={(e) =>
                          handleNoteChange(a.id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </>
      );
    }

    // ❌ chưa điểm danh
    return (
      <>
        <thead>
          <tr>
            <th>Học sinh</th>
            <th>Mã SV</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="3">Tất cả đã điểm danh</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.studentId}>
                <td>{s.fullName}</td>
                <td>{s.studentCode}</td>
                <td>❌ Chưa điểm danh</td>
              </tr>
            ))
          )}
        </tbody>
      </>
    );
  };

  // ================= UI =================

  return (
    <div className="attendance-modal-overlay">
      <div className="attendance-modal-card">
        {/* HEADER */}
        <header>
          <h2>Điểm danh tiết {period}</h2>
          <p>Lớp {className}</p>
          <button onClick={onClose}>X</button>
        </header>

        <div className="attendance-modal-body">
          {/* QR */}
          <div>
            {loading || !currentQrToken ? (
              <p>Đang tạo QR...</p>
            ) : (
              <QRCodeCanvas value={studentUrl} size={200} />
            )}
          </div>

          {/* TABLE */}
          <div>
            <button onClick={() => setActiveTab("attended")}>
              Đã điểm danh ({attendances.length})
            </button>

            <button onClick={() => setActiveTab("unattended")}>
              Chưa điểm danh ({unattendedStudents.length})
            </button>

            <table>
              {renderTable(
                activeTab === "attended"
                  ? attendances
                  : unattendedStudents,
                activeTab === "attended"
              )}
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <button onClick={onClose}>Hủy</button>

          <button
            onClick={async () => {
              if (window.confirm("Xóa hết?")) {
                await clearAttendances(sessionId);
                setAttendances([]);
              }
            }}
          >
            Xóa
          </button>

          <button onClick={handleSave}>
            Hoàn tất
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AttendanceModal;