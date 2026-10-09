import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    qualification: z.string().trim().min(1).optional(),
    specialization: z.string().trim().min(1).optional(),
    clinicalFocus: z.array(z.string()).optional(),
    officeLocation: z.string().trim().optional(),
    email: z.string().email().optional(),
    bio: z.string().optional(),
  }),
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let counselor = await prisma.counselor.findFirst();
    if (!counselor) {
      counselor = await prisma.counselor.create({
        data: {
          name: 'Dr. Evelyn Martinez, PhD',
          title: 'Senior Student Cognitive Psychologist',
          role: 'CLINICAL STAFF',
          rating: 4.9,
          sessionsReviewed: 148,
          qualification: 'PhD in Clinical Psychology, Stanford',
          specialization: 'Cognitive Behavioral Therapy (CBT)',
          clinicalFocus: JSON.stringify(['Academic Burnout', 'ADHD Management', 'Anxiety Disorder', 'Social Adjustment']),
          officeLocation: 'Clinic Hall B, Room 302',
          email: 'e.martinez@university.edu',
          avatarInitials: 'EM',
          bio: 'Dedicated senior psychologist with over 10 years of experience supporting university students through academic, emotional, and social challenges.',
        },
      });
    }
    const data: any = { ...counselor, clinicalFocus: JSON.parse(counselor.clinicalFocus || '[]') };
    return successResponse(res, data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch profile', 500);
  }
});

router.put('/profile', authMiddleware, validate(updateProfileSchema), async (req, res) => {
  try {
    const body = req.body;
    const updateData: any = { ...body };
    if (body.clinicalFocus) {
      updateData.clinicalFocus = JSON.stringify(body.clinicalFocus);
    }
    await prisma.counselor.updateMany({ data: updateData });
    const updated = await prisma.counselor.findFirst();
    if (updated) {
      const data: any = { ...updated, clinicalFocus: JSON.parse(updated.clinicalFocus || '[]') };
      return successResponse(res, data);
    }
    return errorResponse(res, 'Failed to update profile', 500);
  } catch (error) {
    return errorResponse(res, 'Failed to update profile', 500);
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = {
      activeCases: 42,
      thisWeekSessions: 18,
      pendingRequests: 5,
      summary: 'Your afternoon is fully booked with student check-ins.',
    };
    return successResponse(res, stats);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch stats', 500);
  }
});

export default router;