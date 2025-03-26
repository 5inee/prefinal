import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaQuestion, FaUsers, FaKey, FaArrowRight } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateSession = () => {
  const [formData, setFormData] = useState({
    title: '',
    maxPlayers: 10,
    secretCode: ''
  });
  const [errors, setErrors] = useState({});
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // إزالة رسالة الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'سؤال التحدي مطلوب';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'يجب أن يتكون سؤال التحدي من 10 أحرف على الأقل';
    }
    
    const maxPlayersNum = parseInt(formData.maxPlayers);
    if (isNaN(maxPlayersNum) || maxPlayersNum < 2 || maxPlayersNum > 20) {
      newErrors.maxPlayers = 'يجب أن يكون عدد اللاعبين بين 2 و 20';
    }
    
    if (!formData.secretCode) {
      newErrors.secretCode = 'الرمز السري مطلوب';
    } else if (formData.secretCode !== '021') {
      newErrors.secretCode = 'الرمز السري غير صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/sessions/create', formData);
      
      toast.success('تم إنشاء الجلسة بنجاح');
      navigate(`/session/${response.data.session.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الجلسة');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <CreateSessionContainer>
      <div className="container">
        <ContentWrapper>
          <Card
            title="إنشاء جلسة توقعات جديدة"
            subtitle="أنشئ تحدي جديد ودعوة الأصدقاء للمشاركة"
            centered
            elevated
          >
            <Form onSubmit={handleSubmit}>
              <FormInput
                type="text"
                label="سؤال التحدي"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="اكتب السؤال"
                required
                minLength={10}
                icon={FaQuestion}
                error={errors.title}
              />
              
              <FormInput
                type="number"
                label="عدد اللاعبين (2-20)"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleChange}
                placeholder="أدخل عدد اللاعبين"
                required
                min={2}
                max={20}
                icon={FaUsers}
                error={errors.maxPlayers}
              />
              
              <FormInput
                type="password"
                label="الرمز السري"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                placeholder="أدخل الرمز السري للتحقق"
                required
                icon={FaKey}
                error={errors.secretCode}
              />
              
              <ButtonGroup>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جارٍ إنشاء الجلسة...' : 'إنشاء الجلسة'}
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
    </CreateSessionContainer>
  );
};

const CreateSessionContainer = styled.div`
  padding: 40px 0;
`;

const ContentWrapper = styled.div`
  max-width: 600px;
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

export default CreateSession;