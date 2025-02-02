import { Router } from 'express';
import { scanNetwork, wakeDevice, shutdownDevice } from '/utils/networkUtils';

const router = Router();

router.post('/scan', async (req, res) => {
  try {
    const { ipRange } = req.body;
    const devices = await scanNetwork({ ipRange });
    res.json(devices);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/wake', async (req, res) => {
  try {
    const { mac } = req.body;
    const result = await wakeDevice(mac);
    res.json({ success: result });
  } catch (error) {
    console.error('Wake error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/shutdown', async (req, res) => {
  try {
    const { ip, username, password } = req.body;
    const result = await shutdownDevice(ip, username, password);
    res.json({ success: result });
  } catch (error) {
    console.error('Shutdown error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/devices', async (req, res) => {
  try {
    const devices = await scanNetwork({ ipRange: '192.168.1.0/24' });
    res.json(devices);
  } catch (error) {
    console.error('Device scan error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;