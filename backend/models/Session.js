const mongoose = require('mongoose');

// نموذج التوقع
const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// نموذج جلسة التوقعات
const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  code: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  maxPlayers: {
    type: Number,
    required: true,
    min: 2,
    max: 20,
    default: 10
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  predictions: [predictionSchema],
  isComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// دالة مساعدة لإنشاء كود عشوائي من 6 أحرف
sessionSchema.statics.generateUniqueCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // التحقق من عدم تكرار الكود
    const existingSession = await this.findOne({ code });
    if (!existingSession) {
      isUnique = true;
    }
  }
  
  return code;
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;