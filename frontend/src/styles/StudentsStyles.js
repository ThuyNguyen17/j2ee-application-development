import styled from 'styled-components';

export const StudentsContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 24px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
  background: #f4f7fb;
  min-height: 100vh;
`;

export const StudentsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8fbff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
`;

export const StudentsHeader = styled.h2`
  font-size: 30px;
  margin-bottom: 8px;
  color: #172b4d;
`;

export const StudentsPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const StudentsHeaderDescription = styled.p`
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const buttonReset = `
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const PrimaryButton = styled.button`
  ${buttonReset}
  background: #4b83b5;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(75, 131, 181, 0.18);

  &:hover {
    background: #3762a0;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  ${buttonReset}
  background: #ffffff;
  color: #1f2937;
  border: 1px solid #d1d5db;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  ${buttonReset}
  background: #dc3545;
  color: #ffffff;

  &:hover {
    background: #b02a37;
  }
`;

export const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  margin-bottom: 24px;
`;

export const AddStudentForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

export const AddStudentInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:focus {
    border-color: #4b83b5;
    background: #ffffff;
  }
`;

export const AddStudentButton = styled(PrimaryButton)`
  width: fit-content;
`;

export const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const StudentItem = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
`;

export const StudentInfo = styled.div`
  display: grid;
  gap: 8px;
`;

export const StudentName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

export const StudentCode = styled.div`
  color: #475569;
  font-size: 14px;
`;

export const StudentActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const FileLabel = styled.div`
  color: #4b5563;
  margin-bottom: 16px;
  font-size: 14px;
`;

export const EditButton = styled.button`
  ${buttonReset}
  background: #f59e0b;
  color: #ffffff;

  &:hover {
    background: #d97706;
  }
`;

export const CancelButton = styled.button`
  ${buttonReset}
  background: #6b7280;
  color: #ffffff;

  &:hover {
    background: #4b5563;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:focus {
    border-color: #4b83b5;
    background: #ffffff;
  }
`;

export const ClassBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: #e0e7ff;
  color: #4b83b5;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
`;
