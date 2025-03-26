import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaClipboard, 
  FaCheck, 
  FaUsers, 
  FaArrowRight, 
  FaPaperPlane,
  FaTrash,
  FaHourglassHalf
} from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.info('يرجى تسجيل الدخول أولاً');
      return;
    }
    
    // التحميل الأولي للجلسة
    fetchSessionDetails(true);
    
    // تحديث البيانات في الخلفية كل 30 ثانية
    const interval = setInterval(() => {
      if (!submitting) {
        fetchSessionDetails(false); // تمرير false لمنع ظهور حالة التحميل
      }
    }, 30000); // زيادة المدة إلى 30 ثانية بدلاً من 10 ثوانٍ
    
    return () => clearInterval(interval);
  }, [user, sessionId, navigate, submitting]);
  
  const fetchSessionDetails = async (showLoadingState = true) => {
    // فقط تعيين حالة التحميل إذا كان showLoadingState صحيحًا (التحميل الأولي فقط)
    if (showLoadingState) {
      setLoading(true);
    }
    
    try {
      const response = await axios.get(`http://localhost:5000/api/sessions/${sessionId}`);
      setSession(response.data.session);
    } catch (error) {
      console.error('Error fetching session details:', error);
      setError(error.response?.data?.message || 'حدث خطأ أثناء جلب تفاصيل الجلسة');
      
      // إظهار رسالة الخطأ فقط إذا كان showLoadingState صحيحًا (التحميل الأولي)
      if (showLoadingState) {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء جلب تفاصيل الجلسة');
      }
    } finally {
      // تعيين حالة التحميل على false فقط إذا كان showLoadingState صحيحًا
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.code);
    toast.success('تم نسخ الكود');
  };
  
  const handlePredictionChange = (e) => {
    setPrediction(e.target.value);
  };
  
  const handleClearPrediction = () => {
    setPrediction('');
  };
  
  const handleSubmitPrediction = async () => {
    if (!prediction.trim()) {
      toast.warning('يرجى إدخال توقع');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/sessions/predict', {
        sessionId,
        content: prediction
      });
      
      toast.success('تم إرسال التوقع بنجاح');
      fetchSessionDetails(); // إعادة تحميل تفاصيل الجلسة
      setPrediction('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إرسال التوقع');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };
  
  // التحقق مما إذا كان المستخدم يمكنه إضافة توقعه
  const canAddPrediction = () => {
    if (!session) return false;
    return !session.userHasPredicted && !session.isComplete;
  };

  useEffect(() => {
    if (session) {
      console.log('Session details in client:', {
        userHasPredicted: session.userHasPredicted,
        isComplete: session.isComplete,
        canAddPrediction: canAddPrediction()
      });
    }
  }, [session]);
  
  const getRandomColor = (username) => {
    // إنشاء لون عشوائي ثابت بناءً على اسم المستخدم
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#4a4baa', '#5e60ce', '#6930c3', '#7209b7', '#3a0ca3', 
      '#4361ee', '#4895ef', '#4cc9f0', '#64dfdf', '#72efdd'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  const getUserInitial = (username) => {
    return username.charAt(0).toUpperCase();
  };
  
  if (loading) {
    return <LoadingMessage>جارٍ تحميل تفاصيل الجلسة...</LoadingMessage>;
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <Button variant="primary" onClick={() => navigate('/my-sessions')}>
          العودة إلى جلساتي
        </Button>
      </ErrorContainer>
    );
  }
  
  if (!session) {
    return (
      <ErrorContainer>
        <ErrorMessage>لم يتم العثور على الجلسة</ErrorMessage>
        <Button variant="primary" onClick={() => navigate('/my-sessions')}>
          العودة إلى جلساتي
        </Button>
      </ErrorContainer>
    );
  }
  
  return (
    <SessionDetailsContainer>
      <div className="container">
        <Card elevated>
          <SessionHeader>
            <SessionTitle>{session.title}</SessionTitle>
            
            <SessionCode>
              <span>كود الجلسة: {session.code}</span>
              <CopyButton onClick={handleCopyCode}>
                <FaClipboard /> نسخ
              </CopyButton>
            </SessionCode>
            
            <SessionInfo>
              <SessionInfoItem>
                <FaUsers />
                <span>{session.participants} / {session.maxPlayers} مشارك</span>
              </SessionInfoItem>
            </SessionInfo>
            
            <SessionStatus isComplete={session.isComplete}>
              {session.isComplete ? (
                <>
                  <FaCheck /> الجلسة مكتملة
                </>
              ) : (
                <>
                  <FaHourglassHalf /> في انتظار توقعات اللاعبين
                </>
              )}
            </SessionStatus>
          </SessionHeader>
          
          {/* نموذج إدخال التوقع - يظهر فقط إذا لم يقم المستخدم بتوقع بعد والجلسة غير مكتملة */}
          {canAddPrediction() ? (
            <PredictionForm>
              <PredictionLabel>أدخل توقعك:</PredictionLabel>
              <PredictionTextarea
                value={prediction}
                onChange={handlePredictionChange}
                placeholder="اكتب توقعك هنا..."
                rows={4}
              />
              
              <PredictionActions>
                <PredictionInfo>
                  {prediction.length} حرف
                </PredictionInfo>
                <ActionButtons>
                  <Button
                    variant="text"
                    onClick={handleClearPrediction}
                    disabled={!prediction.trim() || submitting}
                  >
                    <FaTrash /> مسح
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={handleSubmitPrediction}
                    disabled={!prediction.trim() || submitting}
                  >
                    <FaPaperPlane /> {submitting ? 'جارٍ الإرسال...' : 'إرسال التوقع'}
                  </Button>
                </ActionButtons>
              </PredictionActions>
              
              {/* المعلومات الإضافية للمساعدة */}
              <PredictionHelpText>
                بعد إرسال توقعك، ستتمكن من رؤية توقعات المشاركين الآخرين.
              </PredictionHelpText>
            </PredictionForm>
          ) : null}
          
          {/* عرض التوقعات للمستخدمين الذين قدموا توقعاتهم أو إذا كانت الجلسة مكتملة */}
          {(session.userHasPredicted || session.isComplete) ? (
            <PredictionsSection>
              <PredictionsTitle>
                التوقعات ({session.predictions.length} / {session.maxPlayers})
              </PredictionsTitle>
              
              <PredictionsList>
                {session.predictions.map((pred) => (
                  <PredictionItem key={pred.id} isCurrentUser={pred.isCurrentUser}>
                    <PredictionUser>
                      <UserAvatar color={getRandomColor(pred.username)}>
                        {getUserInitial(pred.username)}
                      </UserAvatar>
                      <div>
                        <UserName>
                          {pred.username} {pred.isCurrentUser && <CurrentUserBadge>أنت</CurrentUserBadge>}
                        </UserName>
                        <PredictionDate>{formatDate(pred.createdAt)}</PredictionDate>
                      </div>
                    </PredictionUser>
                    
                    <PredictionContent>
                      {pred.content}
                    </PredictionContent>
                  </PredictionItem>
                ))}
              </PredictionsList>
            </PredictionsSection>
          ) : (
            <MessageBox>
              <FaHourglassHalf />
              <p>يجب عليك تقديم توقعك أولاً قبل رؤية توقعات الآخرين</p>
            </MessageBox>
          )}
          
          <BackButton
            variant="text"
            onClick={() => navigate('/my-sessions')}
          >
            <FaArrowRight /> العودة إلى جلساتي
          </BackButton>
        </Card>
      </div>
    </SessionDetailsContainer>
  );
};

// Styled Components
const SessionDetailsContainer = styled.div`
  padding: 40px 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--text-light);
`;

const ErrorContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
  text-align: center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--error-color);
  border-radius: var(--border-radius);
  margin-bottom: 20px;
`;

const SessionHeader = styled.div`
  margin-bottom: 30px;
`;

const SessionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const SessionCode = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  span {
    font-family: monospace;
    background-color: #f5f5f5;
    padding: 8px 15px;
    border-radius: 20px;
    margin-left: 10px;
    font-size: 16px;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    
    span {
      margin-bottom: 10px;
    }
  }
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--secondary-color);
  color: var(--primary-dark);
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: 'Cairo', sans-serif;
  
  svg {
    margin-left: 5px;
  }
  
  &:hover {
    background-color: var(--secondary-dark);
  }
`;

const SessionInfo = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const SessionInfoItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-light);
  margin-left: 15px;
  font-size: 16px;
  
  svg {
    margin-left: 8px;
    color: var(--primary-light);
  }
`;

const SessionStatus = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.isComplete ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)'};
  color: ${props => props.isComplete ? 'var(--success-color)' : 'var(--warning-color)'};
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  
  svg {
    margin-left: 8px;
  }
`;

const PredictionForm = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
`;

const PredictionLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
`;

const PredictionTextarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  resize: vertical;
  font-family: 'Cairo', sans-serif;
  font-size: 16px;
  direction: rtl;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(94, 96, 206, 0.2);
  }
`;

const PredictionActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PredictionInfo = styled.div`
  color: var(--text-light);
  font-size: 14px;
  
  @media (max-width: 576px) {
    margin-bottom: 10px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PredictionHelpText = styled.div`
  margin-top: 15px;
  color: var(--text-light);
  font-size: 14px;
  text-align: center;
  background-color: rgba(94, 96, 206, 0.05);
  padding: 10px;
  border-radius: var(--border-radius);
`;

const PredictionsSection = styled.div`
  margin-bottom: 30px;
`;

const PredictionsTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const PredictionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PredictionItem = styled.div`
  background-color: ${props => props.isCurrentUser ? 'rgba(94, 96, 206, 0.05)' : '#f9f9f9'};
  border-right: ${props => props.isCurrentUser ? '3px solid var(--primary-color)' : 'none'};
  padding: 15px;
  border-radius: var(--border-radius);
`;

const PredictionUser = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  margin-left: 10px;
`;

const UserName = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const CurrentUserBadge = styled.span`
  background-color: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
`;

const PredictionDate = styled.div`
  font-size: 12px;
  color: var(--text-light);
`;

const PredictionContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const MessageBox = styled.div`
  background-color: rgba(255, 193, 7, 0.1);
  color: var(--warning-color);
  padding: 20px;
  border-radius: var(--border-radius);
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  
  svg {
    font-size: 30px;
    margin-bottom: 15px;
  }
  
  p {
    font-size: 16px;
    font-weight: 500;
  }
`;

const BackButton = styled(Button)`
  margin-top: 20px;
  align-self: flex-start;
  
  svg {
    margin-left: 5px;
  }
`;

export default SessionDetails;