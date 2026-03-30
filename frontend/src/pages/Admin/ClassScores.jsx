import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { BsPencil, BsSave, BsX, BsTrash, BsPlus, BsCalculator } from 'react-icons/bs';

const Container = styled.div`
  padding: 20px;
  background: var(--color-bg-primary);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  min-height: 80vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h2`
  color: var(--color-text-primary);
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  min-width: 150px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$variant === 'danger' ? '#ff4757' : props.$variant === 'secondary' ? 'var(--color-bg-secondary)' : '#667eea'};
  color: ${props => props.$variant === 'secondary' ? 'var(--color-text-primary)' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ScoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--color-border-hr);
  }
  
  th {
    background: #667eea;
    color: white;
    font-weight: 600;
    position: sticky;
    top: 0;
  }
  
  tr:hover {
    background: rgba(102, 126, 234, 0.05);
  }
  
  td {
    color: var(--color-text-primary);
  }
`;

const ScoreInput = styled.input`
  width: 60px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  text-align: center;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const WeightInput = styled(ScoreInput)`
  width: 50px;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: var(--color-text-primary);
`;

const StudentCode = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-placeholder);
`;

const AverageCell = styled.td`
  font-weight: bold;
  color: ${props => props.$score >= 8 ? '#2ed573' : props.$score >= 5 ? '#ffa502' : '#ff4757'};
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-bg-primary);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  z-index: 1000;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const ScoreItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
`;

const ClassScores = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [semester, setSemester] = useState(1);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingScores, setEditingScores] = useState([]);

  const scoreTypes = [
    { value: 'ORAL', label: 'Miệng' },
    { value: 'QUIZ_15', label: '15 phút' },
    { value: 'ONE_PERIOD', label: '1 tiết' },
    { value: 'MIDTERM', label: 'Giữa kỳ' },
    { value: 'FINAL', label: 'Cuối kỳ' }
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAssignments();
      fetchStudents();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedAssignment && students.length > 0) {
      fetchScores();
    }
  }, [selectedAssignment, semester, students]);

  const fetchClasses = async () => {
    try {
      const resp = await axios.get('http://localhost:8080/api/v1/class/getall');
      setClasses(resp.data.classes || []);
    } catch (err) {
      console.error('Error fetching classes', err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const resp = await axios.get('http://localhost:8080/api/teaching-assignments');
      // Filter assignments by class name
      const filtered = resp.data.filter(a => 
        a.className && a.className.toLowerCase().includes(selectedClass.toLowerCase())
      );
      setAssignments(filtered);
    } catch (err) {
      console.error('Error fetching assignments', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const resp = await axios.get(`http://localhost:8080/api/students/class/${selectedClass}`);
      setStudents(resp.data || []);
    } catch (err) {
      console.error('Error fetching students', err);
    }
  };

  const fetchScores = async () => {
    setLoading(true);
    try {
      // Get all scores for this teaching assignment
      const resp = await axios.get(`http://localhost:8080/api/scores/teaching-assignment/${selectedAssignment}`);
      const scoreData = {};
      
      resp.data.forEach(score => {
        if (score.semester === parseInt(semester)) {
          scoreData[score.studentId] = score;
        }
      });
      
      setScores(scoreData);
    } catch (err) {
      console.error('Error fetching scores', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (items) => {
    if (!items || items.length === 0) return 0;
    let totalWeight = 0;
    let weightedSum = 0;
    
    items.forEach(item => {
      if (item.value != null && item.weight != null) {
        weightedSum += item.value * item.weight;
        totalWeight += item.weight;
      }
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
  };

  const openEditModal = (student) => {
    const existingScore = scores[student.studentId];
    setEditingStudent(student);
    setEditingScores(existingScore?.items || [
      { type: 'ORAL', value: '', weight: 1, date: new Date().toISOString().split('T')[0] }
    ]);
  };

  const addScoreItem = () => {
    setEditingScores([...editingScores, { 
      type: 'ORAL', 
      value: '', 
      weight: 1, 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeScoreItem = (index) => {
    setEditingScores(editingScores.filter((_, i) => i !== index));
  };

  const updateScoreItem = (index, field, value) => {
    const updated = [...editingScores];
    updated[index] = { ...updated[index], [field]: value };
    setEditingScores(updated);
  };

  const saveScores = async () => {
    try {
      const payload = {
        studentId: editingStudent.studentId,
        teachingAssignmentId: selectedAssignment,
        semester: parseInt(semester),
        academicYearId: new Date().getFullYear().toString(),
        items: editingScores.map(item => ({
          ...item,
          value: parseFloat(item.value) || 0,
          weight: parseFloat(item.weight) || 1
        }))
      };

      const existingScore = scores[editingStudent.studentId];
      
      if (existingScore) {
        await axios.put(`http://localhost:8080/api/scores/${existingScore.id}`, payload);
      } else {
        await axios.post('http://localhost:8080/api/scores', payload);
      }

      setEditingStudent(null);
      fetchScores();
    } catch (err) {
      console.error('Error saving scores', err);
      alert('Lỗi khi lưu điểm: ' + err.message);
    }
  };

  const getAssignmentName = () => {
    const assignment = assignments.find(a => a.id === selectedAssignment);
    return assignment ? `${assignment.subjectName} - ${assignment.teacherName}` : '';
  };

  return (
    <Container>
      <Header>
        <Title>Quản lý Điểm Lớp học</Title>
        <Controls>
          <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Chọn lớp...</option>
            {classes.map(c => {
              const gLevel = c.gradeLevel ? String(c.gradeLevel) : "";
              const cName = c.className || "";
              let label = c.grade || (gLevel && cName ? (cName.startsWith(gLevel) ? cName : gLevel + cName) : cName);
              return <option key={c.id} value={label}>{label}</option>;
            })}
          </Select>

          <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value={1}>Học kỳ 1</option>
            <option value={2}>Học kỳ 2</option>
          </Select>

          <Select value={selectedAssignment} onChange={(e) => setSelectedAssignment(e.target.value)}>
            <option value="">Chọn môn học...</option>
            {assignments.map(a => (
              <option key={a.id} value={a.id}>{a.subjectName} - {a.teacherName}</option>
            ))}
          </Select>
        </Controls>
      </Header>

      {!selectedClass || !selectedAssignment ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-placeholder)' }}>
          Vui lòng chọn lớp và môn học để xem danh sách điểm
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Đang tải...</div>
      ) : (
        <>
          <h3 style={{ marginBottom: '15px', color: 'var(--color-text-primary)' }}>
            {getAssignmentName()} - Học kỳ {semester}
          </h3>
          
          <ScoreTable>
            <thead>
              <tr>
                <th>STT</th>
                <th>Học sinh</th>
                <th>Điểm các cột</th>
                <th>Trung bình</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const scoreData = scores[student.studentId];
                const average = calculateAverage(scoreData?.items);
                
                return (
                  <tr key={student.studentId}>
                    <td>{index + 1}</td>
                    <td>
                      <StudentName>{student.fullName}</StudentName>
                      <StudentCode>{student.studentCode}</StudentCode>
                    </td>
                    <td>
                      {scoreData?.items?.map((item, i) => (
                        <span key={i} style={{ marginRight: '15px', fontSize: '0.9rem' }}>
                          <strong>{scoreTypes.find(t => t.value === item.type)?.label || item.type}:</strong> {item.value}
                          <small style={{ color: 'var(--color-text-placeholder)' }}> (x{item.weight})</small>
                          {i < scoreData.items.length - 1 ? ', ' : ''}
                        </span>
                      )) || <span style={{ color: 'var(--color-text-placeholder)' }}>Chưa có điểm</span>}
                    </td>
                    <AverageCell $score={parseFloat(average)}>
                      {average > 0 ? average : '-'}
                    </AverageCell>
                    <td>
                      <Button $variant="secondary" onClick={() => openEditModal(student)}>
                        <BsPencil /> Sửa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </ScoreTable>
        </>
      )}

      {editingStudent && (
        <>
          <Overlay onClick={() => setEditingStudent(null)} />
          <Modal>
            <h3 style={{ marginBottom: '20px' }}>
              Nhập điểm: {editingStudent.fullName}
            </h3>
            
            {editingScores.map((item, index) => (
              <ScoreItemRow key={index}>
                <Select 
                  value={item.type} 
                  onChange={(e) => updateScoreItem(index, 'type', e.target.value)}
                  style={{ width: '120px' }}
                >
                  {scoreTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
                
                <ScoreInput
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Điểm"
                  value={item.value}
                  onChange={(e) => updateScoreItem(index, 'value', e.target.value)}
                />
                
                <WeightInput
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Hệ số"
                  value={item.weight}
                  onChange={(e) => updateScoreItem(index, 'weight', e.target.value)}
                />
                
                <input
                  type="date"
                  value={item.date}
                  onChange={(e) => updateScoreItem(index, 'date', e.target.value)}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--color-border-hr)' }}
                />
                
                <Button $variant="danger" onClick={() => removeScoreItem(index)}>
                  <BsTrash />
                </Button>
              </ScoreItemRow>
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button onClick={addScoreItem}>
                <BsPlus /> Thêm cột điểm
              </Button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button $variant="secondary" onClick={() => setEditingStudent(null)}>
                  <BsX /> Hủy
                </Button>
                <Button onClick={saveScores}>
                  <BsSave /> Lưu điểm
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default ClassScores;
