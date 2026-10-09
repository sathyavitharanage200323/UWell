import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/apiResponse';

const router = Router();

router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const session = {
      sessionId: `id-${Date.now()}`,
      status: 'active',
      joinUrl: 'uwell-video://session-placeholder',
      appointmentId,
    };
    return successResponse(res, session);
  } catch (error) {
    return errorResponse(res, 'Failed to start video session', 500);
  }
});

export default router;