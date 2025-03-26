import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch } from 'react-icons/fa';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <div className="container">
        <NotFoundContent>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>الصفحة غير موجودة</ErrorTitle>
          <ErrorMessage>
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </ErrorMessage>
          
          <ButtonsGroup>
            <Button variant="primary" as={Link} to="/">
              <FaHome /> العودة للصفحة الرئيسية
            </Button>
            
            <Button variant="secondary" as={Link} to="/my-sessions">
              <FaSearch /> استعراض جلساتي
            </Button>
          </ButtonsGroup>
        </NotFoundContent>
      </div>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  padding: 60px 0;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorCode = styled.div`
  font-size: 120px;
  font-weight: 800;
  color: var(--primary-color);
  opacity: 0.3;
  margin-bottom: -20px;
  
  @media (max-width: 576px) {
    font-size: 80px;
    margin-bottom: -10px;
  }
`;

const ErrorTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    font-size: 28px;
  }
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  color: var(--text-light);
  margin-bottom: 30px;
`;

const ButtonsGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
  
  a {
    svg {
      margin-left: 8px;
    }
  }
`;

export default NotFound;