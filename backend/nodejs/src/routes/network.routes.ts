import { Router } from 'express';
import { NetworkScanner } from '../utils/networkUtils';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const networkScanner = new NetworkScanner();

router.use(authMiddleware);

router.post('/scan', async (req, res) => {
  try {
    const { ipRange } = req.body;
    const devices = await networkScanner.scanNetwork(ipRange);
    res.json(devices);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/wake', async (req, res) => {
  try {
    const { mac } = req.body;
    const result = await networkScanner.wakeOnLan(mac);
    res.json({ success: result });
  } catch (error) {
    console.error('Wake error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/shutdown', async (req, res) => {
  try {
    const { ip, username, password } = req.body;
    const result = await networkScanner.shutdownDevice(ip, username, password);
    res.json({ success: result });
  } catch (error) {
    console.error('Shutdown error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/devices', async (req, res) => {
  try {
    const devices = await networkScanner.scanNetwork('192.168.1.0/24');
    const results = await Promise.all(devices.map(async (device) => {
      const openPorts = await networkScanner.scan_ports(device.ip);
      return {
        name: device.name,
        ip: device.ip,
        openPorts: openPorts
      };
    }));
    res.json(results);
  } catch (error) {
    console.error('Device scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;