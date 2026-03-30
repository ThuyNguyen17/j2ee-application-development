import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Navbar = styled.nav`
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

export const Logo = styled.img`
  width: 50px;
  height: auto;
`;

export const NavigationLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #f4f4f4;
  padding: 20px;
`;

export const SchoolInfo = styled.div`
  margin-top: 20px;
`;

export const SchoolImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  margin-top: 20px;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
`;

export const LoremTextContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 20px;

  p {
    font-size: 18px;
    color: #555;
    line-height: 1.6;
  }
`;

export const AdminRegisterLink = styled(Link)`
  background-color: #2c3e50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
  margin-bottom: 20px;
  display: inline-block;

  &:hover {
    background-color: #34495e;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const LoginButton = styled.button`
  background-color: #2c3e50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;

  &:hover {
    background-color: #34495e;
  }
`;

export const GuestButton = styled.button`
  background-color: #95a5a6;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  margin-left: 10px;

  &:hover {
    background-color: #7f8c8d;
  }
`;
