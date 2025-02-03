import express from 'express';
import { serverPairingService } from '../services/serverPairing.service';

const router = express.Router();

router.post('/register-hub', async (req, res) => {
  try {
    await serverPairingService.registerAsHub();
    res.json({ success: true, message: 'Registered as hub successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to register as hub' });
  }
});

router.post('/register-node', async (req, res) => {
  try {
    const { hubUrl } = req.body;
    if (!hubUrl) {
      return res.status(400).json({ success: false, error: 'Hub URL is required' });
    }
    await serverPairingService.registerAsNode(hubUrl);
    res.json({ success: true, message: 'Registered as node successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to register as node' });
  }
});

router.get('/nodes', async (req, res) => {
  try {
    const nodes = await serverPairingService.getNodes();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch nodes' });
  }
});

router.post('/heartbeat', async (req, res) => {
  try {
    const { nodeId, metrics } = req.body;
    // Handle heartbeat data
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process heartbeat' });
  }
});

export default router;