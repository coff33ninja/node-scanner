import { Router } from 'express';
import { getAllUsers, getUserProfile, updateUserProfile } from 'controllers/user.controller';
import { authenticateJWT } from 'middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, getAllUsers);
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, updateUserProfile);

export const userRoutes = router;
