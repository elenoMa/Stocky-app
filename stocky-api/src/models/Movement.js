import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  previousStock: {
    type: Number,
    required: true,
    min: 0
  },
  newStock: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para date
movementSchema.virtual('date').get(function() {
  return (this.createdAt instanceof Date) ? this.createdAt.toISOString() : null;
});

// Índices para mejorar el rendimiento
movementSchema.index({ productId: 1 });
movementSchema.index({ type: 1 });
movementSchema.index({ createdAt: -1 });
movementSchema.index({ category: 1 });
movementSchema.index({ user: 1 });

const Movement = mongoose.model('Movement', movementSchema);

export default Movement; 