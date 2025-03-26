const jwt = require('jsonwebtoken');
const User = require('../models/User');

// التحقق من وجود رمز مصادقة JWT صحيح
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'الوصول مرفوض، يرجى تسجيل الدخول' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'رمز المصادقة غير صالح' });
  }
};

// التحقق من وجود ضيف أو مستخدم مسجل
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // في حالة الخطأ، نسمح بالمتابعة (المستخدم ضيف)
    next();
  }
};

module.exports = { auth, optionalAuth };