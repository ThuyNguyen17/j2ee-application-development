// ExamStyles.js
import styled from 'styled-components';

export const ExamContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
  padding: 20px;
`;

export const ExamContent = styled.div`
  padding: 20px;
`;

export const ExamHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const AddExamForm = styled.form`
  margin-bottom: 20px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
`;

export const ExamInput = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const AddExamButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ExamList = styled.div`
  margin-top: 20px;
`;

export const ExamItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Keeping for Student Section
export const ExamResultsContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

export const ExamSubject = styled.h3`
  margin-bottom: 10px;
`;

export const ExamResult = styled.p`
  color: #555;
  margin-bottom: 10px;
`;

export const ExamChartContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
`;

// Legacy names for Admin/Legacy if needed
export const ExamForm = AddExamForm;
export const FormLabel = styled.label`margin-bottom: 5px;`;
export const FormInput = ExamInput;
export const AddButton = AddExamButton;
export const SidebarContainer = styled.div`display:none;`;
