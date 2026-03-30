import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
  History, 
  LayoutDashboard, 
  LogOut, 
  QrCode,
  BookOpen,
  Award,
  Library,
  MessageSquare,
  Settings,
  FileText,
  Users,
  GraduationCap,
  Calendar,
  Menu,
  X,
  ClipboardList
} from "lucide-react";
import "./AppShell.css";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => readUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const u = readUser();
    setUser(u);
    if (!u) {
      navigate("/student/login", { replace: true, state: { from: location.pathname } });
      return;
    }
  }, [location.pathname, navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/student/login", { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "STUDENT":
        return [
          { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/student/timetable", icon: CalendarDays, label: "Thời khóa biểu" },
          { to: "/student/scan", icon: QrCode, label: "Điểm danh QR" },
          { to: "/student/history", icon: History, label: "Lịch sử điểm danh" },
          { to: "/student/assignments", icon: FileText, label: "Bài tập" },
          { to: "/student/scores", icon: ClipboardList, label: "Kết quả học tập" },
          { to: "/student/library", icon: Library, label: "Thư viện" },
          { to: "/student/events", icon: Calendar, label: "Sự kiện" },
          { to: "/student/communication", icon: MessageSquare, label: "Tin tức" },
          { to: "/student/settings", icon: Settings, label: "Cài đặt cá nhân" },
        ];

      case "TEACHER":
        return [
          { to: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/teacher/timetable", icon: CalendarDays, label: "Thời khóa biểu" },
          { to: "/teacher/students", icon: BookOpen, label: "Danh sách sinh viên" },
          { to: "/teacher/assignments", icon: FileText, label: "Quản lý bài tập" },
          { to: "/teacher/performance", icon: BookOpen, label: "Kết quả sinh viên" },
          { to: "/teacher/events", icon: Calendar, label: "Sự kiện" },
          { to: "/teacher/communication", icon: MessageSquare, label: "Gửi thông báo" },
          { to: "/teacher/seating-chart", icon: GraduationCap, label: "Sơ đồ lớp" },
          { to: "/teacher/settings", icon: Settings, label: "Cài đặt cá nhân" },
        ];

      case "ADMIN":
        return [
          { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/admin/library", icon: Library, label: "Quản lý thư viện" },
          { to: "/admin/communication", icon: MessageSquare, label: "Quản lý thông báo" },
          { to: "/admin/events", icon: Calendar, label: "Quản lý sự kiện" },
          { to: "/admin/seating-chart", icon: GraduationCap, label: "Quản lý sơ đồ lớp" },
          { to: "/admin/teaching-assignments", icon: BookOpen, label: "Phân công giảng dạy" },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  const roleLabel = user?.role || "UNKNOWN";

  // Don't show layout for login page
  if (location.pathname === '/student/login' || location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className={`app-shell ${!isSidebarOpen ? 'app-shell--collapsed' : ''}`}>
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          <div>
            <h1>S-ATTENDANCE</h1>
            <small>{roleLabel}</small>
          </div>
          <button 
            className="sidebar-toggle-btn" 
            onClick={toggleSidebar}
            type="button"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="app-shell__nav">
          {navigationItems.map((item) => (
            <NavLink key={item.to} className="app-shell__link" to={item.to}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-shell__spacer" />

        <div className="app-shell__meta">
          <div>{user?.fullName || user?.username || "Unknown user"}</div>
          <div className="role">{user?.role || "UNKNOWN"}</div>
          <button className="app-shell__logout" onClick={logout} type="button">
            <LogOut size={16} style={{ marginRight: 8 }} />
            {isSidebarOpen && "Đăng xuất"}
          </button>
        </div>
      </aside>

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
