import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCalendarAlt, FaUsers, FaExternalLinkAlt, FaPlus, FaArrowRight } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.info('يرجى تسجيل الدخول أولاً');
      return;
    }
    
    fetchSessions();
  }, [user, navigate]);
  
  const fetchSessions = async () => {
    setLoading(true);
    
    try {
      const response = await axios.get('http://localhost:5000/api/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      setError('حدث خطأ أثناء جلب الجلسات');
      toast.error('حدث خطأ أثناء جلب الجلسات');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };
  
  return (
    <MySessionsContainer>
      <div className="container">
        <PageHeader>
          <h1>جلساتي السابقة</h1>
          <p>استعراض جميع جلسات التوقع التي شاركت فيها</p>
        </PageHeader>
        
        <ActionButtons>
          <Button
            variant="primary"
            onClick={() => navigate('/create-session')}
          >
            <FaPlus /> إنشاء جلسة جديدة
          </Button>
          
          <Button
            variant="text"
            onClick={() => navigate('/')}
          >
            <FaArrowRight /> العودة
          </Button>
        </ActionButtons>
        
        {loading ? (
          <LoadingMessage>جارٍ تحميل الجلسات...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : sessions.length === 0 ? (
          <NoSessionsMessage>
            <p>لا توجد جلسات سابقة</p>
            <Button
              variant="primary"
              onClick={() => navigate('/create-session')}
            >
              إنشاء أول جلسة
            </Button>
          </NoSessionsMessage>
        ) : (
          <SessionsList>
            {sessions.map((session) => (
              <SessionCard key={session.id}>
                <Card>
                  <SessionHeader>
                    <SessionTitle>{session.title}</SessionTitle>
                    <SessionCode>كود الجلسة: {session.code}</SessionCode>
                  </SessionHeader>
                  
                  <SessionInfo>
                    <SessionInfoItem>
                      <FaCalendarAlt />
                      <span>{formatDate(session.createdAt)}</span>
                    </SessionInfoItem>
                    
                    <SessionInfoItem>
                      <FaUsers />
                      <span>{session.participants} / {session.maxPlayers} مشارك</span>
                    </SessionInfoItem>
                  </SessionInfo>
                  
                  <SessionStatus isComplete={session.isComplete}>
                    {session.isComplete ? 'مكتملة' : 'قيد التقدم'}
                  </SessionStatus>
                  
                  <ViewButton
                    variant="secondary"
                    onClick={() => navigate(`/session/${session.id}`)}
                  >
                    <FaExternalLinkAlt /> عرض التفاصيل
                  </ViewButton>
                </Card>
              </SessionCard>
            ))}
          </SessionsList>
        )}
      </div>
    </MySessionsContainer>
  );
};

const MySessionsContainer = styled.div`
  padding: 40px 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  
  p {
    color: var(--text-light);
    font-size: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  font-size: 18px;
  color: var(--text-light);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--error-color);
  border-radius: var(--border-radius);
  margin-bottom: 20px;
`;

const NoSessionsMessage = styled.div`
  text-align: center;
  padding: 40px;
  border: 2px dashed #ddd;
  border-radius: var(--border-radius);
  
  p {
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--text-light);
  }
`;

const SessionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SessionCard = styled.div`
  height: 100%;
`;

const SessionHeader = styled.div`
  margin-bottom: 15px;
`;

const SessionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 5px;
`;

const SessionCode = styled.div`
  font-size: 14px;
  color: var(--text-light);
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 15px;
  display: inline-block;
`;

const SessionInfo = styled.div`
  display: flex;
  margin-bottom: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SessionInfoItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-light);
  margin-left: 15px;
  font-size: 14px;
  
  svg {
    margin-left: 5px;
    color: var(--primary-light);
  }
  
  @media (max-width: 576px) {
    margin-bottom: 5px;
  }
`;

const SessionStatus = styled.div`
  background-color: ${props => props.isComplete ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)'};
  color: ${props => props.isComplete ? 'var(--success-color)' : 'var(--warning-color)'};
  padding: 5px 10px;
  border-radius: 15px;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
`;

const ViewButton = styled(Button)`
  width: 100%;
  
  svg {
    margin-left: 5px;
  }
`;

export default MySessions;