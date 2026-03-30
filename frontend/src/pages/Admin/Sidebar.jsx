import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom'; 
import { BsGraphUp, 
    BsPeople, 
    BsPerson, 
    BsFileText, 
    BsBook, 
    BsGraphDown, 
    BsCalendar, 
    BsGear, 
    BsChatDots, 
    BsCalendarEvent, 
    BsQuestionSquare 
} from 'react-icons/bs';

import bg1 from '../../assets/bg1.png';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  height: 100%;
  background-color: #2c3e50; /* Dark blue background */
  color: white;
  overflow-y: auto; /* Enable vertical scrolling */
  padding-top: 60px;
  transition: width 0.3s ease; /* Smooth width transition */
  z-index: 1000; /* Ensure sidebar stays above content */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarNavItem = styled.li`
  margin-bottom: 6px;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  color: ${({ isActive }) => (isActive ? 'var(--color-link-active)' : 'var(--color-text-primary)')};
  background: ${({ isActive }) => (isActive ? 'var(--color-hover-primary)' : 'transparent')};
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: var(--color-hover-secondary);
    color: var(--color-text-primary);
  }
`;

const SidebarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const Label = styled.span`
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const SidebarFooter = styled.div`
  padding: 20px 18px;
  border-top: 1px solid var(--color-border-hr);
`;

const ThemeButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--color-hover-secondary);
  }
`;

const ThemeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ThemeText = styled.span`
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const ThemeToggleTrack = styled.div`
  width: ${({ isOpen }) => (isOpen ? '46px' : '0')};
  height: 24px;
  border-radius: 999px;
  background: var(--color-border-hr);
  position: relative;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;

const ThemeToggleIndicator = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ active }) => (active ? '24px' : '3px')};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.3s ease;
`;

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialDark = savedTheme ? savedTheme === 'dark' : document.body.classList.contains('dark-theme');
    setDarkMode(initialDark);
    document.body.classList.toggle('dark-theme', initialDark);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.body.classList.toggle('dark-theme', nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <BsGraphUp /> },
    { path: '/admin/classes', label: 'Classes', icon: <BsPeople /> },
    { path: '/admin/seating-chart', label: 'Seating Chart', icon: <BsPeople /> },
    { path: '/admin/class-scores', label: 'Class Scores', icon: <BsGraphDown /> },
    { path: '/admin/students', label: 'Students', icon: <BsPeople /> },
    { path: '/admin/teachers', label: 'Teachers', icon: <BsPerson /> },
    { path: '/admin/teaching-assignments', label: 'Teaching Assignments', icon: <BsBook /> },
    { path: '/admin/assignments', label: 'Assignments', icon: <BsFileText /> },
    { path: '/admin/exams', label: 'Exams', icon: <BsBook /> },
    { path: '/admin/performance', label: 'Performance', icon: <BsGraphDown /> },
    { path: '/admin/attendance', label: 'Attendance', icon: <BsCalendar /> },
    { path: '/admin/library', label: 'Library', icon: <BsBook /> },
    { path: '/admin/communication', label: 'Announcement', icon: <BsChatDots /> },
    { path: '/admin/events', label: 'Events & Calendar', icon: <BsCalendarEvent /> },
    { path: '/admin/settings', label: 'Settings & Profile', icon: <BsGear /> },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Logo src={bg1} alt="Logo" isOpen={isOpen} />
        <SidebarToggleButton onClick={onToggle}>
          {isOpen ? <BsMoon /> : <BsSun />}
        </SidebarToggleButton>
      </SidebarHeader>

      <SidebarContent>
        <SearchForm>
          <SearchIcon>
            <BsSearch />
          </SearchIcon>
          <SearchInput placeholder="Search" isOpen={isOpen} />
        </SearchForm>

        <SidebarNav>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <SidebarNavItem key={item.path}>
                <SidebarLink to={item.path} isActive={active}>
                  <SidebarIcon>{item.icon}</SidebarIcon>
                  <Label isOpen={isOpen}>{item.label}</Label>
                </SidebarLink>
              </SidebarNavItem>
            );
          })}
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <ThemeButton isOpen={isOpen} onClick={toggleTheme}>
          <ThemeInfo>
            {darkMode ? <BsMoon /> : <BsSun />}
            <ThemeText isOpen={isOpen}>{darkMode ? 'Dark Mode' : 'Light Mode'}</ThemeText>
          </ThemeInfo>
          <ThemeToggleTrack isOpen={isOpen}>
            <ThemeToggleIndicator active={darkMode} />
          </ThemeToggleTrack>
        </ThemeButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;