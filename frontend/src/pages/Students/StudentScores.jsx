import React, { useState, useEffect } from "react";
import { Award, BookOpen, TrendingUp, Calendar } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import "./StudentScores.css";

const API_URL = `${BASE_URL}/api`;

const StudentScores = () => {
  const [scores, setScores] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState(1);
  const [student, setStudent] = useState(null);

  const scoreTypes = {
    ORAL: "Miệng",
    QUIZ_15: "15 phút",
    ONE_PERIOD: "1 tiết",
    MIDTERM: "Giữa kỳ",
    FINAL: "Cuối kỳ",
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setStudent(user);
    if (user.studentId || user.userId) {
      fetchScores(user.studentId || user.userId);
    }
  }, [semester]);

  const fetchScores = async (studentId) => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_URL}/scores/student/${studentId}`);
      const filtered = resp.data.filter((s) => s.semester === semester);
      
      // Fetch teaching assignments to get subject names
      const assignmentIds = filtered.map(s => s.teachingAssignmentId).filter(Boolean);
      if (assignmentIds.length > 0) {
        try {
          const taResp = await axios.get(`${API_URL}/v1/teaching-assignments/all`);
          const allAssignments = taResp.data || [];
          const assignmentMap = {};
          allAssignments.forEach(a => {
            assignmentMap[a.id] = a;
          });
          setAssignments(assignmentMap);
          
          // Enrich scores with subjectName
          const enrichedScores = filtered.map(score => ({
            ...score,
            subjectName: assignmentMap[score.teachingAssignmentId]?.subjectName || "Unknown"
          }));
          setScores(enrichedScores);
        } catch (taErr) {
          console.error("Error fetching teaching assignments:", taErr);
          setScores(filtered);
        }
      } else {
        setScores(filtered);
      }
    } catch (err) {
      console.error("Error fetching scores:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (items) => {
    if (!items || items.length === 0) return 0;
    let totalWeight = 0;
    let weightedSum = 0;
    items.forEach((item) => {
      if (item.value != null && item.weight != null) {
        weightedSum += item.value * item.weight;
        totalWeight += item.weight;
      }
    });
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
  };

  const getRank = (score) => {
    if (score >= 8.5) return { label: "Giỏi", color: "excellent" };
    if (score >= 7.0) return { label: "Khá", color: "good" };
    if (score >= 5.0) return { label: "TB", color: "average" };
    return { label: "Yếu", color: "poor" };
  };

  const overallAverage =
    scores.length > 0
      ? (
          scores.reduce((sum, s) => sum + parseFloat(calculateAverage(s.items)), 0) /
          scores.length
        ).toFixed(2)
      : 0;

  const overallRank = getRank(parseFloat(overallAverage));

  return (
    <div className="student-scores-container">
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen size={28} />
          Kết quả học tập
        </h1>
        <div className="semester-selector">
          <Calendar size={18} />
          <select value={semester} onChange={(e) => setSemester(Number(e.target.value))}>
            <option value={1}>Học kỳ 1</option>
            <option value={2}>Học kỳ 2</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Điểm TB</span>
                <span className="stat-value">{overallAverage}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Award size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Xếp loại</span>
                <span className={`stat-value ${overallRank.color}`}>{overallRank.label}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Số môn học</span>
                <span className="stat-value">{scores.length}</span>
              </div>
            </div>
          </div>

          <div className="scores-table-container">
            <h2 className="section-title">Chi tiết điểm số</h2>
            {scores.length === 0 ? (
              <div className="empty-state">Chưa có điểm cho học kỳ này</div>
            ) : (
              <table className="scores-table">
                <thead>
                  <tr>
                    <th>Môn học</th>
                    <th>Các cột điểm</th>
                    <th>Điểm TB</th>
                    <th>Xếp loại</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => {
                    const avg = calculateAverage(score.items);
                    const rank = getRank(parseFloat(avg));
                    return (
                      <tr key={index}>
                        <td className="subject-name">{score.subjectName || "Unknown"}</td>
                        <td className="score-items">
                          {score.items?.map((item, i) => (
                            <span key={i} className="score-item">
                              {scoreTypes[item.type]}: {item.value}
                              {item.weight !== 1 && (
                                <small> (x{item.weight})</small>
                              )}
                            </span>
                          ))}
                        </td>
                        <td className="average">{avg}</td>
                        <td>
                          <span className={`rank-badge ${rank.color}`}>{rank.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentScores;
