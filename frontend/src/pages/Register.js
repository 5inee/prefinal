import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, user, error, setError } = useContext(AuthContext);
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
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'يجب أن يتكون اسم المستخدم من حرفين على الأقل';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await register(formData.username, formData.password);
      
      if (result.success) {
        toast.success('تم إنشاء الحساب بنجاح');
        navigate('/');
      } else {
        toast.error(result.message || 'فشل إنشاء الحساب');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <RegisterContainer>
      <div className="container">
        <ContentWrapper>
          <Card
            title="إنشاء حساب جديد"
            subtitle="انضم إلينا وابدأ التوقع مع الأصدقاء"
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
                minLength={2}
                maxLength={30}
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
                minLength={6}
                icon={FaLock}
                error={errors.password}
              />
              
              <FormInput
                type="password"
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="أعد إدخال كلمة المرور"
                required
                icon={FaCheckCircle}
                error={errors.confirmPassword}
              />
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <ButtonGroup>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
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
                لديك حساب بالفعل؟ <Link to="/login">اضغط هنا لتسجيل الدخول</Link>
              </p>
            </LinksSection>
          </Card>
        </ContentWrapper>
      </div>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
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

export default Register;