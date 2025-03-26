const express = require('express');
const { register, login, guestLogin } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// مسار تسجيل مستخدم جديد
router.post('/register', register);

// مسار تسجيل الدخول
router.post('/login', login);

// مسار تسجيل الدخول كضيف
router.post('/guest', guestLogin);

// مسار التحقق من صحة الرمز
router.get('/verify', auth, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      isGuest: req.user.isGuest
    }
  });
});

module.exports = router;