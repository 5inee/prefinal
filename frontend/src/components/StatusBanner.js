import React from 'react';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaHourglassHalf 
} from 'react-icons/fa';

const StatusBanner = ({ 
  type = 'info', 
  children,
  isLoading = false
}) => {
  const getIcon = () => {
    if (isLoading) return <FaHourglassHalf className="pulse" />;
    
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'waiting':
        return <FaHourglassHalf className="pulse" />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };
  
  return (
    <Banner className={`status-banner ${type}`}>
      {getIcon()}
      <span>{children}</span>
    </Banner>
  );
};

const Banner = styled.div``;

export default StatusBanner;