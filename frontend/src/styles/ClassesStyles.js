import styled from 'styled-components';

export const ClassesContainer = styled.div`
  display: flex;
`;

export const SidebarContainer = styled.div`
  /* Thêm vào để tránh lỗi thiếu export SidebarContainer */
  width: 250px;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
`;

export const ClassesContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
`;

export const ClassHeader = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 24px;
  color: #2C3E50;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    width: 4px;
    height: 28px;
    background: #749BC2;
    border-radius: 2px;
  }
`;

export const ClassList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

export const ClassItem = styled.div`
  background: linear-gradient(135deg, #91C8E4 0%, #749BC2 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    margin: 6px 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

export const AddClassForm = styled.form`
  background: #F6F4EB;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  select, input {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid #D1D5DB;
    border-radius: 10px;
    font-size: 0.95rem;
    background: white;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #91C8E4;
      box-shadow: 0 0 0 3px rgba(145, 200, 228, 0.2);
    }
  }

  select {
    cursor: pointer;
  }
`;

export const AddClassInput = styled.input`
  padding: 12px 14px;
  border: 2px solid #D1D5DB;
  border-radius: 12px;
  background: #fafbff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #91C8E4;
    box-shadow: 0 0 0 4px rgba(145, 200, 228, 0.15);
  }
`;

export const AddClassButton = styled.button`
  padding: 12px 24px;
  background: #91C8E4;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background: #4682A9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(145, 200, 228, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// Backward-compatible export
export const ClassContainer = ClassesContainer;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

export const EditButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

export const DeleteButton = styled.button`
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.25);
  color: #fff;
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.4);
  }
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #6b7280;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background-color: #4b5563;
  }
`;

// Edit form styles for inline editing within ClassItem
export const EditFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  select, input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.95);
    color: #2C3E50;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #91C8E4;
      box-shadow: 0 0 0 3px rgba(145, 200, 228, 0.3);
    }
  }

  select {
    cursor: pointer;
  }
`;

export const EditFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const EditFormButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;

  button {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
`;

export const SaveButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  color: #4682A9;

  &:hover {
    background: #fff;
    transform: translateY(-1px);
  }
`;

export const CancelEditButton = styled.button`
  background: rgba(0, 0, 0, 0.2);
  color: #fff;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;
