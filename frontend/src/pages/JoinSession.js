import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCode, FaArrowRight, FaPlus } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const JoinSession = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.info('يرجى تسجيل الدخول أولاً');
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    setSessionCode(e.target.value.toUpperCase());
    if (error) setError('');
  };
  
  const validateForm = () => {
    if (!sessionCode.trim()) {
      setError('كود الجلسة مطلوب');
      return false;
    }
    
    if (sessionCode.trim().length !== 6) {
      setError('يجب أن يتكون كود الجلسة من 6 أحرف');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/sessions/join', {
        code: sessionCode
      });
      
      toast.success('تم الانضمام إلى الجلسة بنجاح');
      navigate(`/session/${response.data.session.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الانضمام إلى الجلسة');
      setError(error.response?.data?.message || 'حدث خطأ أثناء الانضمام إلى الجلسة');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <JoinSessionContainer>
      <div className="container">
        <ContentWrapper>
          <Card
            title="انضم إلى جلسة توقعات"
            subtitle="حط الكود"
            centered
            elevated
          >
            <Form onSubmit={handleSubmit}>
              <FormInput
                type="text"
                label="كود الجلسة"
                name="sessionCode"
                value={sessionCode}
                onChange={handleChange}
                placeholder="أدخل كود الجلسة المكون من 6 أحرف"
                required
                maxLength={6}
                icon={FaCode}
                error={error}
              />
              
              <ButtonGroup>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جارٍ الانضمام...' : 'انضم إلى الجلسة'}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/create-session')}
                >
                  <FaPlus /> إنشاء جلسة جديدة
                </Button>
                
                <Button
                  type="button"
                  variant="text"
                  fullWidth
                  onClick={() => navigate('/')}
                >
                  <FaArrowRight /> العودة
                </Button>
              </ButtonGroup>
            </Form>
            

          </Card>
        </ContentWrapper>
      </div>
    </JoinSessionContainer>
  );
};

const JoinSessionContainer = styled.div`
  padding: 40px 0;
`;

const ContentWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Form = styled.form`
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoSection = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: rgba(94, 96, 206, 0.1);
  border-radius: var(--border-radius);
`;

const InfoTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 10px;
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  position: relative;
  padding-right: 15px;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:before {
    content: '•';
    position: absolute;
    right: 0;
    color: var(--primary-color);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export default JoinSession;