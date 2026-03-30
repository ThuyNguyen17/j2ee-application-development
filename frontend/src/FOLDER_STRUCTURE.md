# Frontend Folder Structure

## Tổng quan cấu trúc thư mục

```
src/
├── api/                    # API calls (axios instances)
│   ├── assignmentApi.js
│   ├── classApi.js
│   ├── examApi.js
│   └── ...
├── components/
│   ├── layout/             # Layout components
│   │   ├── AppLayout.jsx   # Main layout với sidebar
│   │   └── AppShell.css    # Layout styles
│   ├── Home.jsx            # Home page component
│   └── ...
├── pages/                  # Page components theo role
│   ├── Admin/              # Admin pages
│   │   ├── index.js        # Export tất cả admin pages
│   │   ├── Dashboard.jsx
│   │   ├── Classes.jsx
│   │   ├── Teachers.jsx
│   │   ├── Students.jsx
│   │   ├── Exam.jsx
│   │   ├── Attendance.jsx
│   │   ├── Performance.jsx
│   │   ├── Assignments.jsx
│   │   ├── Library.jsx
│   │   ├── Announcement.jsx
│   │   ├── EventCalendar.jsx
│   │   ├── SettingsProfile.jsx
│   │   └── TeachingAssignments.jsx
│   │
│   ├── Students/           # Student pages
│   │   ├── index.js        # Export tất cả student pages
│   │   ├── Dashboard.jsx
│   │   ├── Assignments.jsx
│   │   ├── Exam.jsx
│   │   ├── Performance.jsx
│   │   ├── Attendance.jsx
│   │   ├── Library.jsx
│   │   ├── Announcement.jsx
│   │   └── Profile.jsx
│   │
│   ├── Teachers/           # Teacher pages
│   │   ├── index.js        # Export tất cả teacher pages
│   │   ├── Dashboard.jsx
│   │   ├── Classes.jsx
│   │   ├── Students.jsx
│   │   ├── Teachers.jsx
│   │   ├── Assignments.jsx
│   │   ├── Exam.jsx
│   │   ├── Performance.jsx
│   │   ├── Attendance.jsx
│   │   ├── Announcement.jsx
│   │   ├── EventCalendar.jsx
│   │   └── Profile.jsx
│   │
│   ├── AdminDashboard.jsx   # (old - will be deprecated)
│   ├── StudentDashboard.jsx # (old - will be deprecated)
│   ├── TeacherDashboard.jsx # (old - will be deprecated)
│   ├── StudentLogin.jsx
│   ├── StudentScanner.jsx
│   ├── StudentTimetable.jsx
│   ├── TeacherTimetable.jsx
│   ├── AttendanceHistory.jsx
│   ├── SubjectAttendance.jsx
│   └── ...
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── styles/                 # Global styles (nếu cần)
├── assets/                 # Static assets (images, fonts)
└── App.jsx                 # Main app component với routing
```

## Cách import đúng

### Import từ Admin folder:
```javascript
import {
  AdminClasses,
  AdminTeachers,
  AdminStudents,
  AdminExams,
  AdminAttendance,
  AdminPerformance,
  AdminAssignments,
  AdminLibrary,
  AdminAnnouncements,
  AdminEventCalendar,
  AdminSettings,
  AdminTeachingAssignments
} from "./pages/Admin/index.js";
```

### Import từ Students folder:
```javascript
import {
  StudentAssignments,
  StudentExams,
  StudentPerformance,
  StudentAttendance,
  StudentLibrary,
  StudentAnnouncements,
  StudentProfile
} from "./pages/Students/index.js";
```

### Import từ Teachers folder:
```javascript
import {
  TeacherClasses,
  TeacherStudents,
  TeachersList,
  TeacherAssignments,
  TeacherExams,
  TeacherPerformance,
  TeacherAttendance,
  TeacherAnnouncements,
  TeacherEvents,
  TeacherProfile
} from "./pages/Teachers/index.js";
```

## Lưu ý quan trọng

1. **Sidebar**: Các file `Sidebar.jsx` trong `Teachers/`, `Students/`, `Admin/` **KHÔNG ĐƯỢC SỬ DỤNG**. 
   - Sidebar chung được quản lý trong `components/layout/AppLayout.jsx`
   - Menu items được định nghĩa trong `getNavigationItems()` function
   - Muốn sửa sidebar, hãy edit `AppLayout.jsx`

2. **CSS Files**: 
   - Các CSS có thể để alongside JSX files (cùng tên, khác extension)
   - Hoặc tập trung trong `styles/` folder
   - Ví dụ: `TeacherAssignments.jsx` + `TeacherAssignments.css`

3. **Adding new page**:
   - Tạo file JSX trong folder role tương ứng
   - Export trong `index.js` của folder đó
   - Import trong `App.jsx`
   - Add route trong `App.jsx`

## File cần edit khi thêm page mới

1. **Tạo page component**: `src/pages/[Role]/NewPage.jsx`
2. **Export trong index**: `src/pages/[Role]/index.js`
3. **Import trong App**: `src/App.jsx` (thêm vào import statement)
4. **Add route**: `src/App.jsx` (thêm Route component)
5. **Add menu item** (nếu cần): `src/components/layout/AppLayout.jsx` trong `getNavigationItems()`
