import styled from 'styled-components';

export const AssignmentsContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
`;

export const AssignmentsContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
`;

export const AssignmentsHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const AssignmentList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const AssignmentItem = styled.li`
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
`;

export const AssignmentTitle = styled.h3`
  margin-bottom: 5px;
`;

export const AddAssignmentForm = styled.form`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`;

export const AddAssignmentInput = styled.input`
  padding: 14px 16px;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #fafbff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4b83b5;
    box-shadow: 0 0 0 4px rgba(75, 131, 181, 0.12);
  }
`;

export const AddAssignmentTextArea = styled.textarea`
  padding: 14px 16px;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #fafbff;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4b83b5;
    box-shadow: 0 0 0 4px rgba(75, 131, 181, 0.12);
  }
`;

export const AddAssignmentButton = styled.button`
  padding: 12px 20px;
  background-color: #4b83b5; /* Dark Blue */
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #7da1cb; /* Medium Blue hover */
  }
`;

// Backward-compatible exports used by Student Assignments page
export const SidebarContainer = styled.div`
  flex-shrink: 0;
`;
export const AssignmentButton = AddAssignmentButton;
export const AssignmentCard = AssignmentItem;
export const AssignmentDescription = styled.p`
  margin: 8px 0;
  color: #444;
`;
export const AssignmentDoneMessage = styled.p`
  margin-top: 10px;
  color: #28a745;
  font-weight: 600;
`;