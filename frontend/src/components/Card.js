import React from 'react';
import styled from 'styled-components';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  centered = false, 
  elevated = false,
  className
}) => {
  return (
    <CardWrapper elevated={elevated} className={className}>
      {(title || subtitle) && (
        <CardHeader centered={centered}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      
      <CardContent centered={centered}>{children}</CardContent>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  background-color: var(--card-color);
  border-radius: var(--border-radius);
  box-shadow: ${props => props.elevated ? '0 8px 15px rgba(0, 0, 0, 0.1)' : 'var(--shadow)'};
  padding: 20px;
  margin-bottom: 20px;
  transition: var(--transition);
  
  &:hover {
    transform: ${props => props.elevated ? 'translateY(-8px)' : 'translateY(-5px)'};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 20px;
  text-align: ${props => props.centered ? 'center' : 'right'};
`;

const CardTitle = styled.h2`
  margin: 0 0 5px 0;
  color: var(--primary-color);
  font-weight: 700;
  font-size: 22px;
`;

const CardSubtitle = styled.h3`
  margin: 0;
  color: var(--text-light);
  font-weight: 500;
  font-size: 16px;
`;

const CardContent = styled.div`
  text-align: ${props => props.centered ? 'center' : 'right'};
`;

export default Card;