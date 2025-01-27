import { Router } from 'express';
import { getAllUsers, getUserProfile, updateUserProfile } from '@/controllers/user.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getAllUsers);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export const userRoutes = router;