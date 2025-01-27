import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';
import { NetworkController } from '@/controllers/network.controller';

const router = Router();
const networkController = new NetworkController();

// Network scanning routes
router.get('/scan', authMiddleware, networkController.scanNetwork);

// WOL routes
router.post('/wake', authMiddleware, networkController.wakeDevice);

// Device management
router.get('/devices', authMiddleware, networkController.getDevices);
router.post('/devices', authMiddleware, networkController.addDevice);
router.put('/devices/:id', authMiddleware, networkController.updateDevice);
router.delete('/devices/:id', authMiddleware, networkController.deleteDevice);

export { router as networkRoutes };