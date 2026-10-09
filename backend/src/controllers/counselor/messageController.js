const CounselorMessage = require('../../models/counselor/CounselorMessage');
const CounselorStudent = require('../../models/counselor/CounselorStudent');

// GET /api/counselor/messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await CounselorMessage.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('❌ counselor getMessages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// GET /api/counselor/messages/:studentId
exports.getMessageByStudentId = async (req, res) => {
  try {
    const message = await CounselorMessage.findOne({ studentId: req.params.studentId });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.error('❌ counselor getMessageByStudentId error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversation' });
  }
};

// POST /api/counselor/messages
exports.sendMessage = async (req, res) => {
  try {
    const { studentId, text } = req.body;
    if (!studentId || !text) {
      return res.status(400).json({ success: false, message: 'studentId and text are required' });
    }

    const student = await CounselorStudent.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const newMsg = {
      id: `c-${Date.now()}`,
      sender: 'counselor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const conversation = await CounselorMessage.findOne({ studentId });
    if (conversation) {
      const chatHistory = [...(conversation.chatHistory || []), newMsg];
      conversation.chatHistory = chatHistory;
      conversation.lastMessage = text;
      conversation.timestamp = 'Just now';
      await conversation.save();
    } else {
      await CounselorMessage.create({
        _id: `msg-${Date.now()}`,
        studentId,
        counselorId: 'c1',
        studentName: student.name,
        avatarInitials: student.avatarInitials,
        lastMessage: text,
        timestamp: 'Just now',
        unread: false,
        chatHistory: [newMsg],
      });
    }

    return res.status(200).json(newMsg);
  } catch (error) {
    console.error('❌ counselor sendMessage error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};
