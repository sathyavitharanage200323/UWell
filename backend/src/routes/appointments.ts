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

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  }),
  params: z.object({
    id: z.string(),
  }),
});

router.get('/', authMiddleware, validate(querySchema), async (req, res) => {
  try {
    const { take, skip } = req.query as any;
    const appointments = await prisma.appointment.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(res, appointments);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch appointments', 500);
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!appointment) return errorResponse(res, 'Appointment not found', 404);
    return successResponse(res, appointment);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch appointment', 500);
  }
});

router.put('/:id', authMiddleware, validate(updateStatusSchema), async (req, res) => {
  try {
    const appointment = await prisma.appointment.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    return successResponse(res, appointment);
  } catch (error) {
    return errorResponse(res, 'Failed to update appointment', 500);
  }
});

export default router;