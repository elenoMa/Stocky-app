import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  contactPerson: String,
  notes: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier; 