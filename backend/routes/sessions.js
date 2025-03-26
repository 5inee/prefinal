const express = require('express');
const { 
  createSession, 
  joinSession, 
  addPrediction, 
  getSessionDetails, 
  getUserSessions 
} = require('../controllers/sessionController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// تطبيق middleware المصادقة على جميع المسارات
router.use(auth);

// إنشاء جلسة جديدة
router.post('/create', createSession);

// الانضمام إلى جلسة موجودة
router.post('/join', joinSession);

// إضافة توقع إلى جلسة
router.post('/predict', addPrediction);

// الحصول على تفاصيل جلسة محددة
router.get('/:sessionId', getSessionDetails);

// الحصول على قائمة الجلسات للمستخدم الحالي
router.get('/', getUserSessions);

module.exports = router;