import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import * as networkController from '../controllers/network.controller';

const router = Router();

// Wrap controller methods to handle type conversion
router.get('/scan', authenticateJWT, (req: Request, res: Response) => 
  networkController.scanNetwork(req as any, res)
);

router.post('/wake', authenticateJWT, (req: Request, res: Response) => 
  networkController.wakeDevice(req as any, res)
);

router.get('/devices', authenticateJWT, (req: Request, res: Response) => 
  networkController.getDevices(req as any, res)
);

router.post('/devices', authenticateJWT, (req: Request, res: Response) => 
  networkController.addDevice(req as any, res)
);

router.put('/devices/:id', authenticateJWT, (req: Request, res: Response) => 
  networkController.updateDevice(req as any, res)
);

router.delete('/devices/:id', authenticateJWT, (req: Request, res: Response) => 
  networkController.deleteDevice(req as any, res)
);

export default router;