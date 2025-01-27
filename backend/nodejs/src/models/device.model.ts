import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  macAddress: string;
  ipAddress: string;
  vendor?: string;
  lastSeen?: Date;
  isOnline?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  macAddress: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  },
  ipAddress: {
    type: String,
    required: true,
    trim: true
  },
  vendor: {
    type: String,
    trim: true
  },
  lastSeen: {
    type: Date
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
DeviceSchema.index({ userId: 1, macAddress: 1 }, { unique: true });

export const Device = mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema);