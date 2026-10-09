import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/apiResponse';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    const parsed = messages.map((m: any) => ({ ...m, chatHistory: m.chatHistory ? JSON.parse(m.chatHistory) : [] }));
    return successResponse(res, parsed);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch messages', 500);
  }
});

router.get('/:studentId', authMiddleware, async (req, res) => {
  try {
    const message = await prisma.message.findFirst({ where: { studentId: req.params.studentId } });
    if (!message) return errorResponse(res, 'Conversation not found', 404);
    const parsed = { ...message, chatHistory: message.chatHistory ? JSON.parse(message.chatHistory) : [] };
    return successResponse(res, parsed);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch conversation', 500);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { studentId, text } = req.body;
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return errorResponse(res, 'Student not found', 404);
    const newMsg = {
      id: `c-${Date.now()}`,
      sender: 'counselor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const msg = await prisma.message.findFirst({ where: { studentId } });
    if (msg) {
      const chatHistory = msg.chatHistory ? JSON.parse(msg.chatHistory) : [];
      const updated = [...chatHistory, newMsg];
      const result = await prisma.message.update({ where: { id: msg.id }, data: { lastMessage: text, timestamp: 'Just now', chatHistory: JSON.stringify(updated) } });
      return successResponse(res, newMsg);
    } else {
      const result = await prisma.message.create({
        data: {
          studentId,
          counselorId: (await prisma.counselor.findFirst())?.id || 'c1',
          studentName: student.name,
          avatarInitials: student.avatarInitials,
          lastMessage: text,
          timestamp: 'Just now',
          unread: false,
          chatHistory: JSON.stringify([newMsg]),
        },
      });
      return successResponse(res, newMsg);
    }
  } catch (error) {
    return errorResponse(res, 'Failed to send message', 500);
  }
});

export default router;