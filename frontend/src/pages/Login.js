import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // إذا كان المستخدم مسجل الدخول بالفعل، انتقل إلى الصفحة الرئيسية
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // تنظيف رسائل الخطأ عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // إزالة رسالة الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/');
      } else {
        toast.error(result.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <LoginContainer>
      <div className="container">
        <ContentWrapper>
          <Card
            title="تسجيل الدخول"
            subtitle="مرحبًا بعودتك، قم بتسجيل الدخول للمتابعة"
            centered
            elevated
          >
            <Form onSubmit={handleSubmit}>
              <FormInput
                type="text"
                label="اسم المستخدم"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="أدخل اسم المستخدم"
                required
                icon={FaUser}
                error={errors.username}
              />
              
              <FormInput
                type="password"
                label="كلمة المرور"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                required
                icon={FaLock}
                error={errors.password}
              />
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <ButtonGroup>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
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
                ليس لديك حساب؟ <Link to="/register">اضغط هنا لإنشاء حساب</Link>
              </p>
              <p>
                أو يمكنك <Link to="/guest-login">الدخول كضيف</Link>
              </p>
            </LinksSection>
          </Card>
        </ContentWrapper>
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
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

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--error-color);
  padding: 12px 15px;
  border-radius: var(--border-radius);
  margin-top: 15px;
  font-weight: 500;
  text-align: center;
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

export default Login;