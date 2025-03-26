import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimesCircle 
} from 'react-icons/fa';

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 300px;
  pointer-events: none;
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ type }) => {
    switch (type) {
      case 'success': return 'linear-gradient(to right, #06d6a0, #06b88a)';
      case 'error': return 'linear-gradient(to right, #ef476f, #d43d62)';
      case 'warning': return 'linear-gradient(to right, #f9c74f, #f0b429)';
      case 'info': return 'linear-gradient(to right, #118ab2, #0e7994)';
      default: return 'linear-gradient(to right, #06d6a0, #06b88a)';
    }
  }};
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  width: 100%;
  text-align: right;
  animation: slideInDown 0.3s, fadeOut 0.5s 2.5s forwards;
  pointer-events: auto;
  
  @keyframes slideInDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 20px;
`;

const ToastMessage = styled.div`
  flex: 1;
`;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  return { toasts, addToast };
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success': return <FaCheckCircle />;
    case 'error': return <FaTimesCircle />;
    case 'warning': return <FaExclamationTriangle />;
    case 'info': return <FaInfoCircle />;
    default: return <FaCheckCircle />;
  }
};

const ToastPortal = ({ toasts }) => {
  if (toasts.length === 0) return null;
  
  return createPortal(
    <ToastContainer>
      {toasts.map(toast => (
        <ToastItem key={toast.id} type={toast.type}>
          <IconWrapper>{getToastIcon(toast.type)}</IconWrapper>
          <ToastMessage>{toast.message}</ToastMessage>
        </ToastItem>
      ))}
    </ToastContainer>,
    document.body
  );
};

export default ToastPortal;