import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/apiResponse';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const availability = await prisma.availability.findMany({ orderBy: { day: 'asc' } });
    const parsed = availability.map((a: any) => ({ ...a, slots: a.slots ? JSON.parse(a.slots) : [] }));
    return successResponse(res, parsed);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch availability', 500);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { day, slots, startTime, endTime, active = true } = req.body;
    const counselor = await prisma.counselor.findFirst();
    const result = await prisma.availability.create({
      data: {
        counselorId: counselor?.id || 'c1',
        day,
        active,
        startTime,
        endTime,
        slots: JSON.stringify(slots || []),
      },
    });
    return successResponse(res, { ...result, slots: result.slots ? JSON.parse(result.slots) : [] });
  } catch (error) {
    return errorResponse(res, 'Failed to create availability', 500);
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updateData: any = { ...req.body };
    if (updateData.slots) updateData.slots = JSON.stringify(updateData.slots);
    const result = await prisma.availability.update({ where: { id: req.params.id }, data: updateData });
    return successResponse(res, { ...result, slots: result.slots ? JSON.parse(result.slots) : [] });
  } catch (error) {
    return errorResponse(res, 'Failed to update availability', 500);
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.availability.delete({ where: { id: req.params.id } });
    return successResponse(res, { success: true });
  } catch (error) {
    return errorResponse(res, 'Failed to delete availability', 500);
  }
});

export default router;