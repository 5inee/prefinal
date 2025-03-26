const jwt = require('jsonwebtoken');
const User = require('../models/User');

// إنشاء رمز المصادقة JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// تسجيل مستخدم جديد
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // التحقق من وجود البيانات المطلوبة
    if (!username || !password) {
      return res.status(400).json({ message: 'يرجى تقديم اسم المستخدم وكلمة المرور' });
    }
    
    // التحقق من الأسماء المحظورة
    if (isProhibitedUsername(username)) {
      return res.status(403).json({ message: 'عذراً، هذا الاسم غير مسموح به. يرجى اختيار اسم آخر.' });
    }
    
    // التحقق من عدم وجود مستخدم بنفس الاسم
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
    }
    
    // إنشاء المستخدم الجديد
    const user = new User({
      username,
      password,
      isGuest: false
    });
    
    await user.save();
    
    // إنشاء رمز مصادقة
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        isGuest: user.isGuest
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب', error: error.message });
  }
};

// تسجيل الدخول
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // التحقق من وجود البيانات المطلوبة
    if (!username || !password) {
      return res.status(400).json({ message: 'يرجى تقديم اسم المستخدم وكلمة المرور' });
    }
    
    // البحث عن المستخدم
    const user = await User.findOne({ username });
    if (!user || user.isGuest) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    // إنشاء رمز مصادقة
    const token = generateToken(user._id);
    
    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        isGuest: user.isGuest
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: error.message });
  }
};

// تسجيل دخول كضيف
const guestLogin = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'يرجى تقديم اسم المستخدم' });
    }

    // التحقق من الأسماء المحظورة
    if (isProhibitedUsername(username)) {
      return res.status(403).json({ message: 'تستهبل؟ غير الاسم' });
    }
    
    // إنشاء حساب ضيف جديد
    const guestUser = new User({
      username: `${username} (ضيف)`,
      password: Math.random().toString(36).slice(-10), // كلمة مرور عشوائية
      isGuest: true
    });
    
    await guestUser.save();
    
    // إنشاء رمز مصادقة
    const token = generateToken(guestUser._id);
    
    res.status(200).json({
      message: 'تم تسجيل الدخول كضيف بنجاح',
      token,
      user: {
        id: guestUser._id,
        username: guestUser.username,
        isGuest: guestUser.isGuest
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول كضيف', error: error.message });
  }
};

// دالة للتحقق من الأسماء المحظورة
const isProhibitedUsername = (username) => {
  // قائمة بالأسماء المحظورة ومشتقاتها
  const prohibitedNames = [
    // صدام حسين
    'صدام', 'صدام حسين', 'سدام', 'saddam', 'hussein', 'حسين صدام',
    // القذافي
    'قذافي', 'القذافي', 'معمر', 'معمر القذافي', 'gaddafi', 'qaddafi', 'gadafi', 'kadafi',
    // الخميني
    'خميني', 'الخميني', 'خومیني', 'khomeini', 'khomeni', 'خامنئي', 'خامنئى',
    // كريستيانو
    'كريستيانو', 'رونالدو', 'كرستيانو', 'كريستيانو رونالدو', 'cristiano', 'ronaldo', 'cr7'
  ];

  // تحويل النص إلى أحرف صغيرة وإزالة الفراغات الزائدة
  const normalizedUsername = username.toLowerCase().trim();
  
  // التحقق من كل اسم محظور
  return prohibitedNames.some(name => {
    // تحويل الاسم المحظور إلى أحرف صغيرة
    const normalizedName = name.toLowerCase();
    
    // التحقق إذا كان الاسم المدخل يحتوي على الاسم المحظور
    return normalizedUsername.includes(normalizedName) || 
           // أو إذا كان الاسم المحظور يحتوي على الاسم المدخل (للأسماء القصيرة)
           (normalizedName.length > 3 && normalizedName.includes(normalizedUsername));
  });
};

module.exports = {
  register,
  login,
  guestLogin,
  isProhibitedUsername // تصدير الدالة للاستخدام في ملفات أخرى إذا لزم الأمر
};