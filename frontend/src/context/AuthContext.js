import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// إنشاء سياق المصادقة
export const AuthContext = createContext();

// مزود سياق المصادقة
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // التحقق من وجود رمز المصادقة عند بدء التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // تكوين الطلب مع إضافة رمز المصادقة
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // التحقق من صحة الرمز
          const response = await axios.get('http://localhost:5000/api/auth/verify');
          
          setUser(response.data.user);
        } catch (error) {
          // إزالة الرمز غير الصالح
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setError('انتهت جلستك، يرجى تسجيل الدخول مرة أخرى');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // تسجيل مستخدم جديد
  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // حفظ الرمز في التخزين المحلي
      localStorage.setItem('token', token);
      
      // تكوين الطلبات المستقبلية
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء التسجيل');
      return { success: false, message: error.response?.data?.message || 'حدث خطأ أثناء التسجيل' };
    }
  };

  // تسجيل الدخول
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // حفظ الرمز في التخزين المحلي
      localStorage.setItem('token', token);
      
      // تكوين الطلبات المستقبلية
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
      return { success: false, message: error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  // تسجيل دخول كضيف
  const guestLogin = async (username) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/temp-access', {
        username
      });
      
      const { token, user } = response.data;
      
      // حفظ الرمز في التخزين المحلي
      localStorage.setItem('token', token);
      
      // تكوين الطلبات المستقبلية
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول كضيف');
      return { success: false, message: error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول كضيف' };
    }
  };

  // تسجيل الخروج
  const logout = () => {
    // إزالة الرمز من التخزين المحلي
    localStorage.removeItem('token');
    
    // إزالة رمز المصادقة من الطلبات المستقبلية
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        guestLogin,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};