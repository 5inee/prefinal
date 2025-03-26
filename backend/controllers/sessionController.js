const Session = require('../models/Session');
const User = require('../models/User');

// إنشاء جلسة توقعات جديدة
const createSession = async (req, res) => {
  try {
    const { title, maxPlayers, secretCode } = req.body;
    
    // التحقق من وجود البيانات المطلوبة
    if (!title || !maxPlayers) {
      return res.status(400).json({ message: 'يرجى تقديم عنوان الجلسة وعدد اللاعبين' });
    }
    
    // التحقق من الرمز السري
    if (secretCode !== '021') {
      return res.status(403).json({ message: 'الرمز السري غير صحيح' });
    }
    
    // إنشاء كود فريد للجلسة
    const code = await Session.generateUniqueCode();
    
    // إنشاء جلسة جديدة
    const session = new Session({
      title,
      code,
      maxPlayers,
      creator: req.user._id,
      participants: [req.user._id],
      isComplete: false // تأكيد أن الجلسة غير مكتملة عند الإنشاء
    });
    
    await session.save();
    
    res.status(201).json({
      message: 'تم إنشاء الجلسة بنجاح',
      session: {
        id: session._id,
        title: session.title,
        code: session.code,
        maxPlayers: session.maxPlayers,
        participants: session.participants.length,
        isComplete: false,
        userHasPredicted: false,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الجلسة', error: error.message });
  }
};

// الانضمام إلى جلسة موجودة باستخدام الكود
const joinSession = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'يرجى تقديم كود الجلسة' });
    }
    
    // البحث عن الجلسة بالكود
    const session = await Session.findOne({ code });
    
    if (!session) {
      return res.status(404).json({ message: 'الموقع انشخط او انت كاتب الكود غلط' });
    }
    
    // التحقق مما إذا كان المستخدم منضماً بالفعل
    const isParticipant = session.participants.some(
      p => p.toString() === req.user._id.toString()
    );
    
    if (isParticipant) {
      // التحقق مما إذا كان المستخدم قد أدخل توقع بالفعل
      const userHasPredicted = session.predictions.some(
        p => p.user.toString() === req.user._id.toString()
      );
      
      console.log(`User ${req.user.username} is already a participant. Has predicted: ${userHasPredicted}`);
      
      return res.status(200).json({
        message: 'أنت منضم بالفعل إلى هذه الجلسة',
        session: {
          id: session._id,
          title: session.title,
          code: session.code,
          maxPlayers: session.maxPlayers,
          participants: session.participants.length,
          isComplete: session.isComplete,
          userHasPredicted: userHasPredicted,
          createdAt: session.createdAt
        }
      });
    }
    
    // التحقق من عدم تجاوز الحد الأقصى للمشاركين
    if (session.participants.length >= session.maxPlayers) {
      return res.status(400).json({ message: 'الجلسة ممتلئة، لا يمكن الانضمام' });
    }
    
    // إضافة المستخدم إلى المشاركين
    session.participants.push(req.user._id);
    console.log(`User ${req.user.username} joined session. Participants now: ${session.participants.length}`);
    
    // إعادة تقييم حالة اكتمال الجلسة
    if (session.predictions.length === session.participants.length) {
      session.isComplete = true;
    } else {
      session.isComplete = false;
    }
    
    await session.save();
    
    res.status(200).json({
      message: 'تم الانضمام إلى الجلسة بنجاح',
      session: {
        id: session._id,
        title: session.title,
        code: session.code,
        maxPlayers: session.maxPlayers,
        participants: session.participants.length,
        isComplete: session.isComplete,
        userHasPredicted: false, // المستخدم لم يقدم توقع بعد
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Error in joinSession:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء الانضمام إلى الجلسة', error: error.message });
  }
};

// إضافة توقع إلى جلسة
const addPrediction = async (req, res) => {
  try {
    const { sessionId, content } = req.body;
    
    if (!sessionId || !content) {
      return res.status(400).json({ message: 'يرجى تقديم معرف الجلسة ومحتوى التوقع' });
    }
    
    // البحث عن الجلسة
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'لم يتم العثور على الجلسة' });
    }
    
    // التحقق من أن المستخدم مشارك في الجلسة
    const isParticipant = session.participants.some(
      p => p.toString() === req.user._id.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({ message: 'غير مسموح لك بإضافة توقع لهذه الجلسة' });
    }
    
    // التحقق من عدم وجود توقع سابق لهذا المستخدم
    const existingPrediction = session.predictions.find(
      p => p.user.toString() === req.user._id.toString()
    );
    
    if (existingPrediction) {
      return res.status(400).json({ message: 'قمت بالفعل بإضافة توقع لهذه الجلسة' });
    }
    
    // إضافة التوقع
    session.predictions.push({
      user: req.user._id,
      username: req.user.username,
      content
    });
    
    console.log(`Added prediction from user ${req.user.username}, predictions count: ${session.predictions.length}, participants count: ${session.participants.length}`);
    
    // التحقق مما إذا كانت جميع المشاركين قد أضافوا توقعاتهم
    if (session.predictions.length === session.participants.length) {
      session.isComplete = true;
      console.log('Session is now complete');
    } else {
      session.isComplete = false;
      console.log('Session is not complete yet');
    }
    
    await session.save();
    
    res.status(201).json({
      message: 'تم إضافة التوقع بنجاح',
      prediction: {
        username: req.user.username,
        content,
        createdAt: new Date()
      },
      isComplete: session.isComplete
    });
  } catch (error) {
    console.error('Error in addPrediction:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إضافة التوقع', error: error.message });
  }
};

// الحصول على تفاصيل جلسة
const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // البحث عن الجلسة
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'لم يتم العثور على الجلسة' });
    }
    
    // التحقق مما إذا كان المستخدم مشاركًا في الجلسة
    const isParticipant = session.participants.some(
      p => p.toString() === req.user._id.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({ message: 'غير مسموح لك بعرض تفاصيل هذه الجلسة' });
    }
    
    // التحقق مما إذا كان المستخدم قد أضاف توقعه بالفعل
    const userHasPredicted = session.predictions.some(
      p => p.user.toString() === req.user._id.toString()
    );
    
    console.log('User has predicted:', userHasPredicted);
    console.log('Is session complete:', session.isComplete);
    
    // تحضير البيانات التي سيتم إرسالها للمستخدم
    let predictions = [];
    
    // المستخدم يمكنه رؤية التوقعات في حالتين: 
    // 1- قام بالفعل بتقديم توقعه، أو 
    // 2- الجلسة مكتملة (جميع المشاركين قدموا توقعاتهم)
    if (userHasPredicted || session.isComplete) {
      predictions = session.predictions.map(p => ({
        id: p._id,
        username: p.username,
        content: p.content,
        createdAt: p.createdAt,
        isCurrentUser: p.user.toString() === req.user._id.toString()
      }));
    }
    
    res.status(200).json({
      session: {
        id: session._id,
        title: session.title,
        code: session.code,
        maxPlayers: session.maxPlayers,
        participants: session.participants.length,
        predictions: predictions,
        isComplete: session.isComplete,
        userHasPredicted: userHasPredicted,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getSessionDetails:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب تفاصيل الجلسة', error: error.message });
  }
};

// الحصول على قائمة الجلسات التي شارك فيها المستخدم
const getUserSessions = async (req, res) => {
  try {
    // البحث عن جميع الجلسات التي يشارك فيها المستخدم
    const sessions = await Session.find({
      participants: { $in: [req.user._id] }
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${sessions.length} sessions for user ${req.user.username}`);
    
    const sessionsList = sessions.map(session => {
      // التحقق مما إذا كان المستخدم قد أضاف توقعه بالفعل
      const userHasPredicted = session.predictions.some(
        p => p.user.toString() === req.user._id.toString()
      );
      
      return {
        id: session._id,
        title: session.title,
        code: session.code,
        maxPlayers: session.maxPlayers,
        participants: session.participants.length,
        predictionsCount: session.predictions.length,
        isComplete: session.isComplete,
        userHasPredicted,
        createdAt: session.createdAt
      };
    });
    
    res.status(200).json({ sessions: sessionsList });
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب قائمة الجلسات', error: error.message });
  }
};

module.exports = {
  createSession,
  joinSession,
  addPrediction,
  getSessionDetails,
  getUserSessions
};