import React from 'react';
import styled, { css } from 'styled-components';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false, 
  onClick,
  disabled = false
}) => {
  return (
    <StyledButton 
      type={type} 
      variant={variant} 
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  text-align: center;
  border: none;
  font-size: 16px;
  transition: var(--transition);
  font-family: 'Cairo', sans-serif;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.disabled && css`
    opacity: 0.7;
    cursor: not-allowed;
  `}
  
  ${props => props.variant === 'primary' && css`
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    
    &:hover:not(:disabled) {
      background-color: var(--primary-color);
      color: white;
    }
  `}
  
  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: var(--primary-color);
    padding: 8px 16px;
    
    &:hover:not(:disabled) {
      background-color: rgba(94, 96, 206, 0.1);
    }
  `}
  
  ${props => props.variant === 'success' && css`
    background-color: var(--success-color);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #218838;
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.variant === 'warning' && css`
    background-color: var(--warning-color);
    color: #212529;
    
    &:hover:not(:disabled) {
      background-color: #e0a800;
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.variant === 'error' && css`
    background-color: var(--error-color);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #c82333;
      transform: translateY(-2px);
    }
  `}
`;

export default Button;