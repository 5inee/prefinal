import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBolt } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  return (
    <HomeContainer>
      <div className="container">
        {!user ? (
          <WelcomeSection>
            <LogoWrapper>
              <FaBolt className="logo-icon" />
              <LogoText>PredictBattle</LogoText>
            </LogoWrapper>
            
            <Card
              title="PredictBattle"
              subtitle="الموقع ذا بيجلط ام امي"
              centered
              elevated
            >
              <Description>
                خش كضيف الله ياخذك
              </Description>
              
              <ButtonsGroup>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  تسجيل الدخول
                </Button>
                <Button variant="secondary" onClick={() => navigate('/register')}>
                  إنشاء حساب
                </Button>
                <Button variant="text" onClick={() => navigate('/guest-login')}>
                  الدخول كضيف
                </Button>
              </ButtonsGroup>
            </Card>
          </WelcomeSection>
        ) : (
          <DashboardSection>
            <WelcomeUser>مرحبًا، {user.username}!</WelcomeUser>
            
            <CardsGrid>
              <ActionCard>
                <Card 
                  title="انضم إلى جلسة"
                  subtitle= "هنا نفداك"
                  elevated
                >
                  <ActionButton onClick={() => navigate('/join-session')}>
                    انضم الآن
                  </ActionButton>
                </Card>
              </ActionCard>
              
              <ActionCard>
                <Card 
                  title="إنشاء جلسة جديدة"
                  subtitle="ابدأ تحدي توقعات جديد"
                  elevated
                >
                  <ActionButton onClick={() => navigate('/create-session')}>
                    إنشاء جلسة
                  </ActionButton>
                </Card>
              </ActionCard>
              
              <ActionCard>
                <Card 
                  title="جلساتي السابقة"
                  subtitle="استعراض جميع الجلسات السابقة"
                  elevated
                >
                  <ActionButton onClick={() => navigate('/my-sessions')}>
                    عرض الجلسات
                  </ActionButton>
                </Card>
              </ActionCard>
            </CardsGrid>
          </DashboardSection>
        )}
        

      </div>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  padding: 40px 0;
`;

const WelcomeSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  .logo-icon {
    font-size: 40px;
    color: var(--primary-color);
    margin-left: 10px;
  }
`;

const LogoText = styled.h1`
  font-size: 40px;
  font-weight: 800;
  color: var(--primary-color);
  margin: 0;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
  color: var(--text-color);
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  button {
    min-width: 150px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const DashboardSection = styled.section`
  margin-bottom: 60px;
`;

const WelcomeUser = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 30px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ActionCard = styled.div`
  height: 100%;
  
  .card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: var(--transition);
  font-family: 'Cairo', sans-serif;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(94, 96, 206, 0.3);
  }
`;

const FeaturesSection = styled.section`
  margin-top: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 50%;
    transform: translateX(50%);
    width: 50px;
    height: 3px;
    background-color: var(--secondary-color);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FeatureCard = styled.div`
  background-color: var(--card-color);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: var(--shadow);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: var(--text-color);
  line-height: 1.5;
`;

export default Home;