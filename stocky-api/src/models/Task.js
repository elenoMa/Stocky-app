import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  color: { type: String, default: '#3b82f6' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema); 