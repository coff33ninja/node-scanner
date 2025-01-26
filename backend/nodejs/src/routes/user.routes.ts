import { Router } from 'express';

const router = Router();

// TODO: Implement user routes
router.get('/profile', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export const userRoutes = router;
