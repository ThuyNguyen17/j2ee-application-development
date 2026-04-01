import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BsPersonFill, BsPencilSquare, BsSave, BsX, BsTrash, BsPlus, BsGraphUp } from 'react-icons/bs';

const ChartContainer = styled.div`
  padding: 20px;
  /* background: var(--color-bg-primary); */
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  min-height: 80vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: var(--color-text-primary);
  margin: 0;
`;

const ClassSelector = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(80px, 1fr));
  grid-template-rows: repeat(6, minmax(80px, 1fr));
  gap: 16px;
 /* background: var(--color-bg-secondary); */
  background: #f0f2f5;
  padding: 20px;
  border-radius: 12px;
  border: 2px dashed var(--color-border-hr);
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
`;

const Seat = styled.div`
  aspect-ratio: 1;
  min-height: 80px;
  min-width: 80px;
  background: ${props => props.$isOccupied ? 'transparent' : 'rgba(0,0,0,0.05)'};
  border-radius: 8px;
  border: 1px solid var(--color-border-hr);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StudentCard = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$canDrag ? 'grab' : 'default'};
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 0.8rem;
  z-index: 10;
  position: relative; /* CRITICAL FIX: Activates z-index so it floats above other panels during drag */

  &:active {
    cursor: ${props => props.$canDrag ? 'grabbing' : 'default'};
  }
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const StudentName = styled.div`
  font-weight: bold;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const StudentCode = styled.div`
  font-size: 0.7rem;
  opacity: 0.8;
`;

const NoteBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-bg-primary, #ffffff);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  z-index: 1000;
  width: 400px;
  max-width: 90vw;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin: 12px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$variant === 'secondary' ? 'var(--color-bg-secondary)' : '#667eea'};
  color: ${props => props.$variant === 'secondary' ? 'var(--color-text-primary)' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  
  &:hover {
    opacity: 0.9;
  }
`;

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const ClassCard = styled(motion.div)`
 /* background: var(--color-bg-secondary); */
  background: #ffffff; /* Nền thẻ màu trắng */
  border: 1px solid var(--color-border-hr);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  h3 {
    margin: 0;
    color: var(--color-text-primary);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: var(--color-text-placeholder);
`;

const MainContent = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 20px;
  align-items: flex-start;
`;

const LeftSection = styled.div`
  flex: 2;
  background: var(--color-bg-secondary);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid var(--color-border-hr);
  
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 20px;
`;

const RightSection = styled.div`
  flex: 1;
  background: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid var(--color-border-hr);
  display: flex;
  flex-direction: column;
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 10px;
`;

const ScoreInput = styled.input`
  width: 70px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  text-align: center;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ScoreItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
`;

const ScoreSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
`;

const GridLabel = styled.div`
  margin-bottom: 20px;
  text-align: center;
  
  .desk-label {
    background: #4b6cb7;
    color: white;
    padding: 8px 40px;
    border-radius: 4px;
    font-weight: bold;
    display: inline-block;
  }
`;

const ClassroomSeatingChart = ({ role = 'teacher' }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  
  // Score management state
  const [editingScores, setEditingScores] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [scoreItems, setScoreItems] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [semester, setSemester] = useState(1);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const isAdmin = role === 'admin';
  
  const scoreTypes = [
    { value: 'ORAL', label: 'Miệng' },
    { value: 'QUIZ_15', label: '15 phút' },
    { value: 'ONE_PERIOD', label: '1 tiết' },
    { value: 'MIDTERM', label: 'Giữa kỳ' },
    { value: 'FINAL', label: 'Cuối kỳ' }
  ];

  useEffect(() => {
    fetchClasses();
    fetchCurrentTeacher();
    // Khôi phục lớp đã chọn từ localStorage
    const savedClass = localStorage.getItem('selectedClass');
    if (savedClass) {
      setSelectedClass(savedClass);
    }
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const resp = await axios.get('http://localhost:8080/api/v1/class/getall');
      const classList = resp.data.classes || [];
      setClasses(classList);
    } catch (err) {
      console.error('Error fetching classes', err);
    }
  };

  const fetchStudents = async (className) => {
    setLoading(true);
    try {
      const resp = await axios.get(`http://localhost:8080/api/students/class/${className}`);
      console.log('Fetched students:', resp.data);
      setStudents(resp.data);
    } catch (err) {
      console.error('Error fetching students', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (student, event, info) => {
    if (!isAdmin) return;
    
    // Use document.elementFromPoint to find the element under the cursor
    const element = document.elementFromPoint(info.point.x, info.point.y);
    const seatId = element?.closest('[data-seat-id]')?.getAttribute('data-seat-id');
    const isRightPanel = element?.closest('#student-list-panel') !== null;
    
    console.log('handleDragEnd:', { studentId: student.studentId, seatId, isRightPanel, selectedClass });
    
    if (seatId) {
      const [r, c] = seatId.split('-').map(Number);
      
      // Check if seat is occupied
      const occupied = students.find(s => s.seatRow === r && s.seatColumn === c && s.studentId !== student.studentId);
      
      if (!occupied) {
        try {
          console.log('Calling API to save seat:', { row: r, col: c });
          const resp = await axios.put(`http://localhost:8080/api/students/${student.studentId}/className/${selectedClass}/seating`, {
            seatRow: r,
            seatColumn: c
          });
          console.log('API response:', resp.data);
          
          setStudents(prev => prev.map(s => 
            s.studentId === student.studentId ? { ...s, seatRow: r, seatColumn: c } : s
          ));
        } catch (err) {
          console.error('Error updating seat', err);
        }
      }
    } else if (isRightPanel || student.seatRow !== null) {
      // Dropped on right panel or outside grid - unassign the student
      try {
        console.log('Calling API to unassign seat');
        const resp = await axios.put(`http://localhost:8080/api/students/${student.studentId}/className/${selectedClass}/seating`, {
          seatRow: null,
          seatColumn: null
        });
        console.log('API response:', resp.data);
        setStudents(prev => prev.map(s => 
          s.studentId === student.studentId ? { ...s, seatRow: null, seatColumn: null } : s
        ));
      } catch (err) {
        console.error('Error unassigning seat', err);
      }
    }
  };

  const unassign = async (student) => {
    if (!isAdmin) return;
    try {
      await axios.put(`http://localhost:8080/api/students/${student.studentId}/className/${selectedClass}/seating`, {
        seatRow: null,
        seatColumn: null
      });
      setStudents(prev => prev.map(s => 
        s.studentId === student.studentId ? { ...s, seatRow: null, seatColumn: null } : s
      ));
    } catch (err) {
      console.error('Error unassigning seat', err);
    }
  };

  const handleSelectClass = (className) => {
    setSelectedClass(className);
    localStorage.setItem('selectedClass', className);
  };

  const handleChangeClass = () => {
    setSelectedClass('');
    localStorage.removeItem('selectedClass');
  };

  const openNoteModal = (student) => {
    setEditingNote(student);
    setNoteContent(student.notes || '');
  };

  const saveNote = async () => {
    try {
      await axios.put(`http://localhost:8080/api/students/${editingNote.studentId}/className/${selectedClass}/seating`, {
        notes: noteContent
      });
      
      setStudents(prev => prev.map(s => 
        s.studentId === editingNote.studentId ? { ...s, notes: noteContent } : s
      ));
      setEditingNote(null);
    } catch (err) {
      console.error('Error saving note', err);
    }
  };

  const fetchCurrentTeacher = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.teacherId) {
        setCurrentTeacher(user);
      }
    } catch (err) {
      console.error('Error fetching current teacher', err);
    }
  };

  // Score management functions
  const fetchAssignments = async () => {
    try {
      let url;
      if (isAdmin) {
        // Admin lấy tất cả teaching assignments của lớp này
        url = 'http://localhost:8080/api/v1/teaching-assignments/all';
      } else if (currentTeacher?.teacherId) {
        // Teacher chỉ lấy các môn mình được phân công
        url = `http://localhost:8080/api/v1/teaching-assignments/teacher/${currentTeacher.teacherId}`;
      } else {
        return [];
      }
      
      console.log('fetchAssignments - URL:', url);
      const resp = await axios.get(url);
      console.log('fetchAssignments - raw data:', resp.data);
      
      // Filter assignments by class name
      const filtered = resp.data.filter(a => {
        const match = a.className && a.className.toLowerCase().includes(selectedClass.toLowerCase());
        console.log('Checking assignment:', a.subjectName, 'className:', a.className, 'match:', match);
        return match;
      });
      
      setAssignments(filtered);
      return filtered;
    } catch (err) {
      console.error('Error fetching assignments', err);
      return [];
    }
  };

  const fetchStudentScores = async (studentId) => {
    try {
      const resp = await axios.get(`http://localhost:8080/api/scores/student/${studentId}`);
      setStudentScores(resp.data || []);
    } catch (err) {
      console.error('Error fetching scores', err);
      setStudentScores([]);
    }
  };

  const openScoreModal = async (student) => {
    setViewingStudent(student);
    setEditingScores(true);
    setScoreItems([{ type: 'ORAL', value: '', weight: 1, date: new Date().toISOString().split('T')[0] }]);
    setCurrentAssignment(null);
    setSelectedAssignment('');
    
    console.log('openScoreModal - currentTeacher:', currentTeacher);
    console.log('openScoreModal - selectedClass:', selectedClass);
    
    // Fetch assignments and auto-detect based on teacher
    const classAssignments = await fetchAssignments();
    fetchStudentScores(student.studentId);
    
    console.log('openScoreModal - classAssignments:', classAssignments);
    console.log('openScoreModal - assignments state:', assignments);
    
    // Auto-select assignment based on current teacher
    if (classAssignments.length > 0) {
      let teacherAssignment = null;
      
      if (currentTeacher?.teacherId) {
        // Try match by teacherId first
        teacherAssignment = classAssignments.find(a => 
          a.teacherId === currentTeacher.teacherId
        );
      }
      
      // Fallback: match by teacher name
      if (!teacherAssignment && currentTeacher?.fullName) {
        teacherAssignment = classAssignments.find(a => 
          a.teacherName?.toLowerCase().includes(currentTeacher.fullName.toLowerCase()) ||
          currentTeacher.fullName.toLowerCase().includes(a.teacherName?.toLowerCase())
        );
      }
      
      // Fallback: if only one assignment for this class, use it
      if (!teacherAssignment && classAssignments.length === 1) {
        teacherAssignment = classAssignments[0];
      }
      
      if (teacherAssignment) {
        console.log('Found assignment:', teacherAssignment);
        setSelectedAssignment(teacherAssignment.id);
        setCurrentAssignment(teacherAssignment);
      } else {
        console.log('No matching assignment found');
      }
    }
  };

  const addScoreItem = () => {
    setScoreItems([...scoreItems, { 
      type: 'ORAL', 
      value: '', 
      weight: 1, 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeScoreItem = (index) => {
    setScoreItems(scoreItems.filter((_, i) => i !== index));
  };

  const updateScoreItem = (index, field, value) => {
    const updated = [...scoreItems];
    updated[index] = { ...updated[index], [field]: value };
    setScoreItems(updated);
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

  const saveStudentScores = async () => {
    if (!selectedAssignment) {
      alert('Vui lòng chọn môn học');
      return;
    }
    
    try {
      const payload = {
        studentId: viewingStudent.studentId,
        teachingAssignmentId: selectedAssignment,
        semester: parseInt(semester),
        academicYearId: new Date().getFullYear().toString(),
        items: scoreItems.map(item => ({
          ...item,
          value: parseFloat(item.value) || 0,
          weight: parseFloat(item.weight) || 1
        }))
      };

      const existingScore = studentScores.find(s => 
        s.teachingAssignmentId === selectedAssignment && s.semester === parseInt(semester)
      );
      
      if (existingScore) {
        await axios.put(`http://localhost:8080/api/scores/${existingScore.id}`, payload);
      } else {
        await axios.post('http://localhost:8080/api/scores', payload);
      }

      fetchStudentScores(viewingStudent.studentId);
      setEditingScores(false);
      setScoreItems([{ type: 'ORAL', value: '', weight: 1, date: new Date().toISOString().split('T')[0] }]);
    } catch (err) {
      console.error('Error saving scores', err);
      alert('Lỗi khi lưu điểm: ' + err.message);
    }
  };

  const renderGrid = () => {
    const seats = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const student = students.find(s => s.seatRow === r && s.seatColumn === c);
        seats.push(
          <Seat 
            key={`seat-${r}-${c}`} 
            $isOccupied={!!student}
            data-seat-id={`${r}-${c}`}
          >
            {student && (
              <StudentCard
                $canDrag={isAdmin}
                drag={isAdmin}
                dragSnapToOrigin={true}
                dragElastic={0}
                whileDrag={{ scale: 1.05, zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                onDragEnd={(e, info) => handleDragEnd(student, e, info)}
                initial={false}
              >
                <BsPersonFill size={20} />
                <StudentName title={student.fullName}>{student.fullName.split(' ').pop()}</StudentName>
                {isAdmin && (
                  <div 
                    style={{position: 'absolute', top: 2, right: 2, cursor: 'pointer', opacity: 0.8, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    onClick={(e) => { e.stopPropagation(); unassign(student); }}
                  >
                    <BsX size={14} />
                  </div>
                )}
                {student.notes && <NoteBadge onClick={(e) => { e.stopPropagation(); openNoteModal(student); }}>!</NoteBadge>}
                <div 
                  style={{position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', opacity: 0.7}} 
                  onClick={(e) => { e.stopPropagation(); openNoteModal(student); }}
                >
                  <BsPencilSquare size={14}/>
                </div>
                <div 
                  style={{position: 'absolute', top: 5, left: 5, cursor: 'pointer', opacity: 0.8, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                  onClick={(e) => { e.stopPropagation(); openScoreModal(student); }}
                  title="Xem điểm"
                >
                  <BsGraphUp size={12}/>
                </div>
              </StudentCard>
            )}
            {!student && <span style={{fontSize: '0.6rem', opacity: 0.2}}>{r+1}-{c+1}</span>}
          </Seat>
        );
      }
    }
    return seats;
  };

  const unassignedStudents = students.filter(s => s.seatRow === null || s.seatColumn === null);

  return (
    <ChartContainer>
      <Header>
        <Title>{isAdmin ? 'Quản lý Vị trí Chỗ ngồi' : 'Sơ đồ Lớp học'}</Title>
        {selectedClass && (
           <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
             <div style={{background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold'}}>
                Lớp: {selectedClass}
             </div>
             <Button $variant="secondary" onClick={handleChangeClass}>
                <BsX /> Đổi lớp
             </Button>
           </div>
        )}
      </Header>

      {!selectedClass ? (
        <SelectionGrid>
          {classes.map(c => {
            // Robust label logic: avoid prepending if className already starts with gradeLevel
            let label = "";
            const gLevel = c.gradeLevel ? String(c.gradeLevel) : "";
            const cName = c.className || "";
            
            if (c.grade) {
              label = c.grade;
            } else if (gLevel && cName) {
              if (cName.startsWith(gLevel)) {
                label = cName;
              } else {
                label = gLevel + cName;
              }
            } else {
              label = cName || gLevel || 'Unnamed Class';
            }

            return (
              <ClassCard 
                key={c.id} 
                onClick={() => handleSelectClass(label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>{label}</h3>
                <p style={{fontSize: '0.8rem', opacity: 0.6, marginTop: 10}}>Nhấn để xem sơ đồ</p>
              </ClassCard>
            );
          })}
          {classes.length === 0 && <EmptyState>Đang tải danh sách lớp học hoặc không có lớp nào...</EmptyState>}
        </SelectionGrid>
      ) : (
        <MainContent>
          <LeftSection>
            <GridLabel>
               <div className="desk-label">BÀN GIÁO VIÊN</div>
            </GridLabel>
            <Grid id="seating-grid" style={{maxWidth: '600px'}}>
              {renderGrid()}
            </Grid>
          </LeftSection>

          {isAdmin && (
            <RightSection id="student-list-panel">
              <h3 style={{marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10}}>
                <BsPersonFill /> Danh sách HS ({unassignedStudents.length})
              </h3>
              <p style={{fontSize: '0.8rem', opacity: 0.6, marginBottom: 15}}>Kéo học sinh vào ô lưới ở bên trái để xếp chỗ. Kéo từ lưới về đây để bỏ xếp chỗ.</p>
              <StudentList>
                {unassignedStudents.map(s => (
                   <div key={s.studentId} style={{width: '100%', height: '80px'}}>
                      <StudentCard
                        $canDrag={true}
                        drag={true}
                        dragSnapToOrigin={true}
                        dragElastic={0}
                        whileDrag={{ scale: 1.05, zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        onDragEnd={(e, info) => handleDragEnd(s, e, info)}
                      >
                        <BsPersonFill size={18} />
                        <StudentName title={s.fullName}>{s.fullName.split(' ').pop()}</StudentName>
                        <StudentCode>{s.studentCode}</StudentCode>
                        <div 
                          style={{position: 'absolute', top: 2, right: 2, cursor: 'pointer', opacity: 0.8, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                          onClick={(e) => { e.stopPropagation(); openScoreModal(s); }}
                          title="Xem điểm"
                        >
                          <BsGraphUp size={12}/>
                        </div>
                      </StudentCard>
                   </div>
                ))}
                {unassignedStudents.length === 0 && (
                  <div style={{gridColumn: 'span 2', textAlign: 'center', padding: 40, opacity: 0.5}}>
                    Tất cả học sinh đã được xếp chỗ.
                  </div>
                )}
              </StudentList>
            </RightSection>
          )}

          {!isAdmin && role === 'teacher' && (
             <RightSection style={{flex: 0.5}}>
                 <h3>Thông tin lớp</h3>
                 <p>Tổng số: {students.length}</p>
                 <p>Đã xếp chỗ: {students.length - unassignedStudents.length}</p>
             </RightSection>
          )}
        </MainContent>
      )}

      <AnimatePresence>
        {editingNote && (
          <>
            <Overlay 
              initial={{opacity: 0}} 
              animate={{opacity: 1}} 
              exit={{opacity: 0}} 
              onClick={() => setEditingNote(null)} 
            />
            <Modal
              initial={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
              animate={{scale: 1, opacity: 1, x: '-50%', y: '-50%'}}
              exit={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
            >
              <h3>Ghi chú cho {editingNote.fullName}</h3>
              <TextArea 
                placeholder="Nhập ghi chú hoặc điểm số cho học sinh này..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
                <Button $variant="secondary" onClick={() => setEditingNote(null)}>Hủy</Button>
                <Button onClick={saveNote}>Lưu ghi chú</Button>
              </div>
            </Modal>
          </>
        )}

        {editingScores && viewingStudent && (
          <>
            <Overlay 
              initial={{opacity: 0}} 
              animate={{opacity: 1}} 
              exit={{opacity: 0}} 
              onClick={() => setEditingScores(false)} 
            />
            <Modal
              initial={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
              animate={{scale: 1, opacity: 1, x: '-50%', y: '-50%'}}
              exit={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
              style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <h3>Quản lý điểm: {viewingStudent.fullName}</h3>
              
              {currentAssignment ? (
                <div style={{ marginBottom: '20px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                  <strong>Môn học:</strong> {currentAssignment.subjectName}
                  {currentAssignment.teacherName && (
                    <span style={{ color: 'var(--color-text-placeholder)', marginLeft: '10px' }}>({currentAssignment.teacherName})</span>
                  )}
                </div>
              ) : assignments.length === 1 ? (
                // Nếu chỉ có 1 môn, tự động chọn và hiển thị luôn
                <div style={{ marginBottom: '20px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                  <strong>Môn học:</strong> {assignments[0].subjectName}
                  {assignments[0].teacherName && (
                    <span style={{ color: 'var(--color-text-placeholder)', marginLeft: '10px' }}>({assignments[0].teacherName})</span>
                  )}
                  {setSelectedAssignment(assignments[0].id)}
                  {setCurrentAssignment(assignments[0])}
                </div>
              ) : assignments.length > 1 ? (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Môn học:</label>
                  <ScoreSelect 
                    value={selectedAssignment} 
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedAssignment(selectedId);
                      const selected = assignments.find(a => a.id === selectedId);
                      setCurrentAssignment(selected);
                    }}
                    style={{ width: '100%' }}
                  >
                    <option value="">Chọn môn học...</option>
                    {assignments.map(a => (
                      <option key={a.id} value={a.id}>{a.subjectName}</option>
                    ))}
                  </ScoreSelect>
                </div>
              ) : (
                <div style={{ marginBottom: '20px', padding: '10px', background: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
                  Bạn không được phân công giảng dạy môn nào trong lớp này.
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Học kỳ:</label>
                <ScoreSelect 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value={1}>Học kỳ 1</option>
                  <option value={2}>Học kỳ 2</option>
                </ScoreSelect>
              </div>

              <h4 style={{ marginBottom: '15px' }}>Nhập điểm:</h4>
              {scoreItems.map((item, index) => (
                <ScoreItemRow key={index}>
                  <ScoreSelect 
                    value={item.type} 
                    onChange={(e) => updateScoreItem(index, 'type', e.target.value)}
                  >
                    {scoreTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </ScoreSelect>
                  
                  <ScoreInput
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Điểm"
                    value={item.value}
                    onChange={(e) => updateScoreItem(index, 'value', e.target.value)}
                  />
                  
                  <ScoreInput
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Hệ số"
                    value={item.weight}
                    onChange={(e) => updateScoreItem(index, 'weight', e.target.value)}
                    style={{ width: '60px' }}
                  />
                  
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => updateScoreItem(index, 'date', e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border-hr)' }}
                  />
                  
                  <Button $variant="secondary" onClick={() => removeScoreItem(index)} style={{ padding: '8px' }}>
                    <BsTrash />
                  </Button>
                </ScoreItemRow>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
                <Button onClick={addScoreItem}>
                  <BsPlus /> Thêm cột điểm
                </Button>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button $variant="secondary" onClick={() => { setEditingScores(false); setCurrentAssignment(null); }}>
                    <BsX /> Hủy
                  </Button>
                  <Button onClick={saveStudentScores}>
                    <BsSave /> Lưu điểm
                  </Button>
                </div>
              </div>

              {studentScores.length > 0 && (
                <>
                  <h4 style={{ marginBottom: '15px', marginTop: '20px', borderTop: '1px solid var(--color-border-hr)', paddingTop: '20px' }}>
                    Điểm đã lưu:
                  </h4>
                  {studentScores.map((score, idx) => {
                    const assignment = assignments.find(a => a.id === score.teachingAssignmentId);
                    return (
                      <div key={idx} style={{ marginBottom: '15px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                        <strong>{assignment?.subjectName || 'Unknown Subject'}</strong> - HK{score.semester}
                        <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
                          {score.items?.map((item, i) => (
                            <span key={i} style={{ marginRight: '15px' }}>
                              {scoreTypes.find(t => t.value === item.type)?.label}: {item.value}
                              {item.weight && item.weight !== 1 && (
                                <span style={{ color: 'var(--color-text-placeholder)' }}> (x{item.weight})</span>
                              )}
                            </span>
                          ))}
                        </div>
                        <div style={{ marginTop: '5px', fontWeight: 'bold', color: '#667eea' }}>
                          TB: {calculateAverage(score.items)}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </Modal>
          </>
        )}
      </AnimatePresence>
    </ChartContainer>
  );
};

export default ClassroomSeatingChart;
