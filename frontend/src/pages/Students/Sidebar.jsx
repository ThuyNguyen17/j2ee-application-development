import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { BsGraphUp, BsFileText, BsBook, BsGraphDown, BsCalendar, BsGear, BsChatDots, BsSearch, BsMoon, BsSun, BsBell, BsCalendarEvent, BsClipboardData } from 'react-icons/bs';

import bg1 from '../../assets/bg1.png';

const SidebarContainer = styled.aside`
  position: sticky;
  top: 0;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? '270px' : '90px')};
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-sidebar);
  border-right: 1px solid var(--color-border-hr);
  box-shadow: 0 3px 15px var(--color-shadow);
  transition: width 0.4s ease, background 0.4s ease;
  z-index: 1000;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px;
  border-bottom: 1px solid var(--color-border-hr);
`;

const Logo = styled.img`
  width: ${({ isOpen }) => (isOpen ? '42px' : '36px')};
  height: auto;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;

const SidebarToggleButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;

  &:hover {
    background: var(--color-hover-secondary);
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 20px 18px;
  overflow-y: auto;
`;

const SearchForm = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--color-bg-secondary);
  margin-bottom: 20px;
  transition: background 0.3s ease;
`;

const SearchIcon = styled.div`
  color: var(--color-text-placeholder);
  font-size: 18px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

  &::placeholder {
    color: var(--color-text-placeholder);
  }
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
    { path: '/student/dashboard', label: 'Dashboard', icon: <BsGraphUp /> },
    { path: '/student/assignments', label: 'Assignments', icon: <BsFileText /> },
    { path: '/student/exams', label: 'Exams', icon: <BsBook /> },
    { path: '/student/performance', label: 'Performance', icon: <BsGraphDown /> },
    { path: '/student/scores', label: 'Kết quả học tập', icon: <BsClipboardData /> },
    { path: '/student/attendance', label: 'Attendance', icon: <BsCalendar /> },
    { path: '/student/library', label: 'Library', icon: <BsBook /> },
    { path: '/student/notifications', label: 'Thông báo', icon: <BsBell /> },
    { path: '/student/events', label: 'Sự kiện', icon: <BsCalendarEvent /> },
    { path: '/student/communication', label: 'Announcement', icon: <BsChatDots /> },
    { path: '/student/settings', label: 'Profile', icon: <BsGear /> },
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