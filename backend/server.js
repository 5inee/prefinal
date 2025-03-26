const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// تحميل المتغيرات البيئية
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// تكوين الوسائط (Middleware)
app.use(cors());
app.use(express.json());

// إعداد اتصال قاعدة البيانات MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('تم الاتصال بقاعدة البيانات MongoDB بنجاح');
  })
  .catch((err) => {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err.message);
  });

// تسجيل المسارات (Routes)
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// مسار اختبار بسيط
app.get('/', (req, res) => {
  res.send('مرحبًا بك في خادم PredictBattle API');
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});