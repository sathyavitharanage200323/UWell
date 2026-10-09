import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { z } from 'zod';

const router = Router();

const querySchema = z.object({
  query: z.object({
    take: z.coerce.number().optional().default(20),
    skip: z.coerce.number().optional().default(0),
  }),
});

router.get('/', authMiddleware, validate(querySchema), async (req, res) => {
  try {
    const { take, skip } = req.query as any;
    const students = await prisma.student.findMany({ take, skip, orderBy: { createdAt: 'desc' } });
    const parsed = students.map((s: any) => ({
      ...s,
      moodHistory: s.moodHistory ? JSON.parse(s.moodHistory) : [],
    }));
    return successResponse(res, parsed);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch students', 500);
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) return errorResponse(res, 'Student not found', 404);
    const parsed = { ...student, moodHistory: student.moodHistory ? JSON.parse(student.moodHistory) : [] };
    return successResponse(res, parsed);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch student', 500);
  }
});

router.post('/:id/notes', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    const student = await prisma.student.update({ where: { id: req.params.id }, data: { sessionNotesHistory: notes } });
    const parsed = { ...student, moodHistory: student.moodHistory ? JSON.parse(student.moodHistory) : [] };
    return successResponse(res, parsed);
  } catch (error) {
    return errorResponse(res, 'Failed to save notes', 500);
  }
});

export default router;