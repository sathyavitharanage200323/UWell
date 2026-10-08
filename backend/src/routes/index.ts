import { Router } from 'express';
import counselorRoutes from './counselor';
import appointmentRoutes from './appointments';
import studentRoutes from './students';
import messageRoutes from './messages';
import availabilityRoutes from './availability';
import videoSessionRoutes from './videoSession';

const router = Router();

router.use('/counselor', counselorRoutes);
router.use('/counselor/appointments', appointmentRoutes);
router.use('/counselor/students', studentRoutes);
router.use('/counselor/messages', messageRoutes);
router.use('/counselor/availability', availabilityRoutes);
router.use('/counselor/video-session', videoSessionRoutes);

export default router;