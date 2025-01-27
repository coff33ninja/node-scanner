import { Router } from 'express';
import { authenticateJWT } from '@/middleware/auth.middleware';
import { NetworkController } from '@/controllers/network.controller';

const router = Router();
const networkController = new NetworkController();

// Network scanning routes
router.get('/scan', authenticateJWT, networkController.scanNetwork);

// WOL routes
router.post('/wake', authenticateJWT, networkController.wakeDevice);

// Device management
router.get('/devices', authenticateJWT, networkController.getDevices);
router.post('/devices', authenticateJWT, networkController.addDevice);
router.put('/devices/:id', authenticateJWT, networkController.updateDevice);
router.delete('/devices/:id', authenticateJWT, networkController.deleteDevice);

export { router as networkRoutes };