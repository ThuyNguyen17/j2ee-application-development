import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Maximize, 
  ShieldAlert, 
  Clock, 
  Lock,
  MessageCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Terminal,
  MousePointer,
  Copy
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const SeriousExamContainer = ({ 
  children, 
  onClose, 
  onAutoSubmit, 
  title, 
  assignmentId,
  userId,
  maxWarnings = 3,
  strictMode = true,
  isSubmitting = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const [lastWarning, setLastWarning] = useState("");

  const logViolation = async (type, details) => {
    console.log(`[SeriousExam] Logging violation: ${type} - ${details}`, {userId, assignmentId});
    if (!userId || !assignmentId) {
        console.error("[SeriousExam] Missing userId or assignmentId, cannot log violation.");
        return;
    }
    try {
      await axios.post(`${BASE_URL}/api/v1/violations/log`, {
        userId,
        assignmentId,
        violationType: type,
        details: details
      });
      console.log(`[SeriousExam] Successfully logged violation to backend`);
    } catch (err) {
      console.error("Failed to log violation:", err);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isLocked) {
        triggerWarning("TAB_SWITCH", "Bạn đã chuyển tab hoặc rời khỏi trang!");
      }
    };

    const handleBlur = () => {
      if (!isLocked) {
        triggerWarning("WINDOW_BLUR", "Bạn đã thoát khỏi khu vực làm bài!");
      }
    };

    const handleKeyDown = (e) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, PrintScreen
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        triggerWarning("KEYBOARD_SHORTCUT", "Hành động (F12/Ctrl+U/...) bị cấm trong chế độ này!");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerWarning("CONTEXT_MENU", "Chuột phải bị vô hiệu hóa trong lúc làm bài!");
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      triggerWarning("COPY_PASTE", "Sao chép/Dán bị cấm trong chế chế độ này!");
    };

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && strictMode && isStarted && !isLocked) {
        triggerWarning("FULLSCREEN_EXIT", "Bạn đã thoát chế độ toàn màn hình!");
      }
    };

    if (strictMode && isStarted) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('copy', handleCopyPaste);
      document.addEventListener('paste', handleCopyPaste);
      document.addEventListener('cut', handleCopyPaste);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }

    const interval = setInterval(() => {
      if (isStarted && !isLocked && !isSubmitting) {
        setTimer(prev => prev + 1);
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(interval);
    };
  }, [warnings, isLocked, strictMode, isFullscreen, isSubmitting, isStarted]);

  const triggerWarning = (type, reason) => {
    if (isLocked || isSubmitting) return;
    
    // De-bounce warnings (same reason twice in 2 seconds)
    if (lastWarning === reason) return;
    setLastWarning(reason);
    setTimeout(() => setLastWarning(""), 2000);

    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    logViolation(type, reason);
    
    if (newWarnings >= maxWarnings) {
      setIsLocked(true);
      alert(`⚠️ CHẶN TRUY CẬP: \nBạn đã vi phạm quy chế thi (${newWarnings}/${maxWarnings}). \nBài làm đang được nộp tự động...`);
      onAutoSubmit();
    } else {
      alert(`⚠️ CẢNH BÁO VI PHẠM (${newWarnings}/${maxWarnings}): \n${reason}`);
    }
  };

  const enterFullscreen = () => {
    setIsStarted(true);
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="serious-exam-container-root" ref={containerRef} style={{ background: isFullscreen ? 'var(--bg-main)' : 'transparent', height: isFullscreen ? '100vh' : 'auto', overflowY: 'auto' }}>
      {!isFullscreen && strictMode && !isLocked ? (
        <div className="serious-exam-prestart">
          <div className="prestart-card">
            <ShieldAlert size={64} color="#ef4444" />
            <h1>CHẾ ĐỘ THI NGHIÊM TÚC</h1>
            <div className="rules">
              <p><ChevronRight size={16} /> Phải làm bài ở trạng thái <strong>Toàn màn hình</strong>.</p>
              <p><ChevronRight size={16} /> <strong>Không</strong> được chuyển tab hoặc rời trình duyệt.</p>
              <p><ChevronRight size={16} /> <strong>Không</strong> được mở DevTools (F12) hoặc inspect.</p>
              <p><ChevronRight size={16} /> Vi phạm <strong>{maxWarnings} lần</strong> hệ thống sẽ tự nộp bài.</p>
            </div>
            <button className="start-exam-btn" onClick={enterFullscreen}>
              Bắt đầu làm bài & Toàn màn hình
            </button>
            <button className="back-btn" onClick={onClose}>Quay lại</button>
          </div>
        </div>
      ) : (
        <div className="serious-exam-wrapper">

      <div className="exam-header-bar">
        <div className="exam-title-area">
          <Lock size={18} />
          <span>{title} - Đang giám sát</span>
        </div>
        
        <div className="exam-stats-area">
          <div className="stat-pill warning">
            <AlertTriangle size={16} />
            <span>Vi phạm: {warnings}/{maxWarnings}</span>
          </div>
          <div className="stat-pill timer">
            <Clock size={16} />
            <span>Thời gian: {formatTime(timer)}</span>
          </div>
        </div>
        
        <div className="user-area">
          <ShieldAlert size={18} />
          {isLocked && <span className="locked-badge">Hệ thống đã khóa</span>}
        </div>
      </div>
      
      <div className="exam-main-content">
        {isLocked ? (
          <div className="locked-overlay">
            <div className="lock-message">
              <Lock size={48} />
              <h2>BÀI THI ĐÃ BỊ KHÓA</h2>
              <p>Bạn đã vi phạm quy chế thi vượt mức cho phép.</p>
              <p>Bài làm đang được gửi đến giáo viên...</p>
            </div>
          </div>
        ) : children}
      </div>
      </div>
        )}
    </div>
  );
};

export default SeriousExamContainer;
