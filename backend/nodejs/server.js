import express from 'express';
import cors from 'cors';
import { NetworkScanner } from './networkUtils.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const networkScanner = new NetworkScanner();

app.post('/api/network/scan', async (req, res) => {
  try {
    const { ipRange } = req.body;
    const devices = await networkScanner.scanNetwork(ipRange);
    res.json(devices);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/network/wake', async (req, res) => {
  try {
    const { mac } = req.body;
    const result = await networkScanner.wakeOnLan(mac);
    res.json({ success: result });
  } catch (error) {
    console.error('Wake error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/network/shutdown', async (req, res) => {
  try {
    const { ip, username, password } = req.body;
    const result = await networkScanner.shutdownDevice(ip, username, password);
    res.json({ success: result });
  } catch (error) {
    console.error('Shutdown error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
