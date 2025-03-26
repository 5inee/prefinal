import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBolt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <Logo to="/">
            <FaBolt className="logo-icon" />
            <span>PredictBattle</span>
          </Logo>
          
          {user ? (
            <NavItems>
              <UserInfo>
                <FaUser className="user-icon" />
                <span>{user.username}</span>
              </UserInfo>
              
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                <span>تسجيل الخروج</span>
              </LogoutButton>
            </NavItems>
          ) : (
            <NavItems>
              <LoginButton to="/login">تسجيل الدخول</LoginButton>
              <RegisterButton to="/register">إنشاء حساب</RegisterButton>
            </NavItems>
          )}
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  padding: 15px 0;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  
  .logo-icon {
    margin-left: 10px;
    font-size: 28px;
    color: var(--secondary-color);
  }
  
  &:hover {
    color: white;
    transform: scale(1.05);
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
  }
`;

const LoginButton = styled(Link)`
  color: white;
  margin-left: 15px;
  padding: 8px 20px;
  border-radius: 25px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const RegisterButton = styled(Link)`
  color: var(--primary-dark);
  background-color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 600;
  
  &:hover {
    background-color: var(--secondary-color);
    color: var(--primary-dark);
    transform: translateY(-2px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  
  .user-icon {
    margin-left: 8px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  color: white;
  background-color: transparent;
  border: none;
  padding: 8px 15px;
  border-radius: 25px;
  font-family: 'Cairo', sans-serif;
  
  svg {
    margin-left: 8px;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Header;