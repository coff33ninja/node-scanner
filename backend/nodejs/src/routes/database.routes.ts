import express from 'express';
import { resetDatabase } from '../utils/dbInit';
import { isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/reset', isAdmin, (req, res) => {
  try {
    const success = resetDatabase();
    if (success) {
      res.status(200).json({ message: 'Database reset successfully' });
    } else {
      res.status(500).json({ error: 'Failed to reset database' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;