import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaArrowRight } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GuestLogin = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { guestLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // إذا كان المستخدم مسجل الدخول بالفعل، انتقل إلى الصفحة الرئيسية
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    setUsername(e.target.value);
    if (error) setError('');
  };
  
  const validateForm = () => {
    if (!username.trim()) {
      setError('الاسم مطلوب');
      return false;
    }
    
    if (username.trim().length < 2) {
      setError('يجب أن يتكون الاسم من حرفين على الأقل');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await guestLogin(username);
      
      if (result.success) {
        toast.success('تم تسجيل الدخول كضيف بنجاح');
        navigate('/');
      } else {
        toast.error(result.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <GuestLoginContainer>
      <div className="container">
        <ContentWrapper>
          <Card
            title="الدخول كضيف"
            subtitle="جرب المنصة بدون تسجيل حساب كامل"
            centered
            elevated
          >
            <Form onSubmit={handleSubmit}>
              <FormInput
                type="text"
                label="الاسم"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="أدخل اسمك"
                required
                minLength={2}
                maxLength={30}
                icon={FaUser}
                error={error}
              />
              
              <InfoMessage>
               الأسامي المحظورة: القذافي، صدام حسين، الخميني، كريستيانو.
                <BraveNote>
                  إذا كنت تستخدم متصفح Brave وواجهت مشكلة، يرجى تعطيل حماية Shields مؤقتًا.
                </BraveNote>
              </InfoMessage>
              
              <ButtonGroup>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جارٍ التسجيل...' : 'الدخول كضيف'}
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
            
            <LinksSection>
              <p>
                تريد حساباً كاملاً؟ <Link to="/register">اضغط هنا للتسجيل</Link>
              </p>
              <p>
                لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
              </p>
            </LinksSection>
          </Card>
        </ContentWrapper>
      </div>
    </GuestLoginContainer>
  );
};

const GuestLoginContainer = styled.div`
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

const InfoMessage = styled.div`
  background-color: rgba(23, 162, 184, 0.1);
  color: var(--info-color);
  padding: 12px 15px;
  border-radius: var(--border-radius);
  margin-top: 15px;
  font-weight: 500;
  text-align: center;
`;

const BraveNote = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #e67e22;
`;

const LinksSection = styled.div`
  text-align: center;
  margin-top: 20px;
  
  p {
    margin-bottom: 10px;
  }
  
  a {
    color: var(--primary-color);
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default GuestLogin;