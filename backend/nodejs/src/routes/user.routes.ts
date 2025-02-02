import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for profile route (if needed in the future)
const profileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Placeholder for future routes
// router.get('/profile', profileLimiter, (req, res) => {
//     res.send('Profile data');
// });

export default router;