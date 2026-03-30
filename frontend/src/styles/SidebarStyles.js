import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  background-color: #2c3e50;
  color: #fff;
  height: 100vh;
  padding-top: 20px;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
`;

export const SidebarHeader = styled.div`
  padding: 20px;
  text-align: center;
`;

export const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
`;

export const SidebarNavItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 18px;
  color: #bdc3c7;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
    color: #fff;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SidebarIcon = styled.div`
  font-size: 20px;
`;

export const SidebarToggle = styled.div`
  position: absolute;
  top: 20px;
  right: ${({ isOpen }) => (isOpen ? '20px' : '50%')};
  transform: ${({ isOpen }) => (isOpen ? 'none' : 'translateX(50%)')};
  cursor: pointer;
  font-size: 24px;
`;