import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { Device } from '../models/device.model';
import { networkUtils } from '../utils/networkUtils';

export const scanNetwork = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const devices = await networkUtils.scanNetwork([]);
    return res.json(devices);
  } catch (error) {
    return res.status(500).json({ message: 'Error scanning network', error });
  }
};

export const wakeDevice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { macAddress } = req.body;
    await networkUtils.wakeDevice(macAddress);
    return res.json({ message: 'Wake packet sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending wake packet', error });
  }
};

export const getDevices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const devices = await Device.find({ userId: req.user._id });
    return res.json(devices);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching devices', error });
  }
};

export const addDevice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const device = new Device({
      ...req.body,
      userId: req.user._id
    });
    await device.save();
    return res.status(201).json(device);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding device', error });
  }
};

export const updateDevice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    return res.json(device);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating device', error });
  }
};

export const deleteDevice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    return res.json({ message: 'Device deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting device', error });
  }
};