import styled from 'styled-components';

export const PerformanceContainer = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  transition: margin-left 0.3s ease;
`;

export const PerformanceContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
`;

export const PerformanceHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const PerformanceGraphs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const PerformanceGraph = styled.div`
  flex: 1 1 280px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
`;

export const PerformanceInfo = styled.div`
  flex: 1 1 280px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
`;

// Backward-compatible exports used by pages
export const SchoolPerformance = PerformanceInfo;
export const IndividualPerformance = PerformanceInfo;
export const PerformanceGraphContainer = PerformanceGraph;
export const TotalMarks = styled.p`
  margin: 0;
  font-weight: 600;
  color: #333;
`;