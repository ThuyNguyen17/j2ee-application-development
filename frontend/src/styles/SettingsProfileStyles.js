import styled from 'styled-components';
import { User, Mail, Phone, Award, Edit2, LogOut } from 'lucide-react';

export const ProfileContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px 24px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
`;

export const ProfileContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.15);
  overflow: hidden;
`;

export const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;
  position: relative;
`;

export const ProfileTitle = styled.h2`
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: 700;
`;

export const ProfileSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
`;

export const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  color: #0ea5e9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: 700;
  margin: -60px auto 0;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
  border: 4px solid white;
  position: relative;
  z-index: 10;
`;

export const ProfileCard = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

export const ProfileDetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #f1f5f9;
    border-color: #0ea5e9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
  }
`;

export const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.span`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const Value = styled.span`
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LogoutButton = styled(EditButton)`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);

  &:hover {
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
  }
`;

// Legacy exports for backward compatibility
export const ProfileInfo = styled.p`
  margin-bottom: 10px;
`;

export const ProfileLabel = styled.label`
  font-weight: bold;
`;