import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  minStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maxStock: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: false
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'low-stock'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para lastUpdated
productSchema.virtual('lastUpdated').get(function() {
  return (this.updatedAt instanceof Date) ? this.updatedAt.toISOString() : null;
});

// Middleware para actualizar el status basado en el stock
productSchema.pre('save', function(next) {
  if (this.stock <= this.minStock) {
    this.status = 'low-stock';
  } else if (this.status === 'low-stock') {
    this.status = 'active';
  }
  next();
});

// Índices para mejorar el rendimiento
productSchema.index({ name: 'text', sku: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ stock: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product; 