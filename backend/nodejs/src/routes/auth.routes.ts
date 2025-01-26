import { Router } from 'express';

const router = Router();

// TODO: Implement authentication routes
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export const authRoutes = router;
