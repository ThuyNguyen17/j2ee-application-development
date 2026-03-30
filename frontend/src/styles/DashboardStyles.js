import styled from 'styled-components';

export const AdminDashboardContainer = styled.div`
  display: flex;
`;

export const StudentDashboardContainer = styled.div`
  display: flex;
`;

export const TeacherDashboardContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px;
  margin-left: ${({ isOpen }) => (isOpen ? '270px' : '90px')};
  transition: margin-left 0.3s ease, background 0.3s ease;
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  box-sizing: border-box;
`;

export const TopContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const BottomContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const Section = styled.section`
  flex: 1;
  margin-right: 20px;
  min-width: 300px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 16px;
  color: var(--color-text-primary);
`;

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

export const Card = styled.div`
  background: var(--color-bg-card);
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  flex: 1;
  min-width: 180px;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--color-text-secondary);
`;

export const CardContent = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
`;
