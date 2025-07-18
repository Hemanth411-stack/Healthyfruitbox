import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, 

  price: { type: Number, required: true }, 
  
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
  
  description: { type: String },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
