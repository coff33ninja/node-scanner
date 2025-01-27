import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  macAddress: {
    type: String,
    required: true,
    match: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  },
  ipAddress: {
    type: String,
    required: true,
    match: /^(\d{1,3}\.){3}\d{1,3}$/
  },
  lastWake: {
    type: Date
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'unknown'],
    default: 'unknown'
  }
}, {
  timestamps: true
});

export const Device = mongoose.model('Device', deviceSchema);