import { Request, Response } from 'express';
import { Device } from '@/models/device.model';
import { networkUtils } from '@/utils/networkUtils';

export class NetworkController {
  // Network scanning
  async scanNetwork(req: Request, res: Response) {
    try {
      const scanOptions = req.body;
      if (!scanOptions) {
        return res.status(400).json({ error: 'Scan options are required' });
      }
      const devices = await networkUtils.scanNetwork(scanOptions);
      res.json({ devices });
    } catch (error) {
      res.status(500).json({ error: 'Failed to scan network' });
    }
  }

  // Wake-on-LAN
  async wakeDevice(req: Request, res: Response) {
    try {
      const { macAddress } = req.body;
      if (!macAddress || !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress)) {
        return res.status(400).json({ error: 'Valid MAC address is required' });
      }

      await networkUtils.wakeDevice(macAddress);
      res.json({ success: true, message: 'Wake-on-LAN packet sent' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send Wake-on-LAN packet' });
    }
  }

  // Device management
  async getDevices(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const devices = await Device.find({ userId });
      res.json({ devices });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }

  async addDevice(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, macAddress, ipAddress } = req.body;

      if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress)) {
        return res.status(400).json({ error: 'Invalid MAC address format' });
      }

      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ipAddress)) {
        return res.status(400).json({ error: 'Invalid IP address format' });
      }

      const device = new Device({
        userId,
        name,
        macAddress,
        ipAddress
      });

      await device.save();
      res.status(201).json({ device });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add device' });
    }
  }

  async updateDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const update = req.body;

      const device = await Device.findOneAndUpdate(
        { _id: id, userId },
        update,
        { new: true }
      );

      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      res.json({ device });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update device' });
    }
  }

  async deleteDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const device = await Device.findOneAndDelete({ _id: id, userId });

      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete device' });
    }
  }
}
