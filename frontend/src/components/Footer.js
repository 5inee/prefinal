import React from 'react';
import styled from 'styled-components';
import { FaBolt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <LogoSection>
            <FaBolt className="logo-icon" />
            <span>PredictBattle</span>
          </LogoSection>
          
          <Copyright>
            القرشيناااات لو مجوووووشش
          </Copyright>
          

        </FooterContent>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: var(--primary-dark);
  color: white;
  padding: 20px 0;
  margin-top: 50px;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  
  .logo-icon {
    margin-left: 8px;
    color: var(--secondary-color);
    font-size: 24px;
  }
`;

const Copyright = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.9;
`;

const Credits = styled.div`
  font-size: 14px;
  opacity: 0.9;
  
  .heart-icon {
    color: var(--error-color);
    margin: 0 5px;
    animation: beat 1.5s infinite;
  }
  
  @keyframes beat {
    0%, 100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1);
    }
  }
`;

export default Footer;