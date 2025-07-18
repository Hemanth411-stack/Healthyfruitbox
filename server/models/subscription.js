import mongoose from 'mongoose';

const productSubSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productType: {
    type: String,
    enum: ['fruitbox', 'juice'],
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  basePrice: {
    type: Number,
    required: true
  },
  addOnPrices: {
    type: Map,
    of: Number,
    default: {}, // Only used if productType === 'fruitbox'
  }
}, { _id: false });

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  products: [productSubSchema], // array of products in one subscription

  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'PhonePe'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'awaiting_approval'],
    default: 'pending',
  },
  paymentProof: {
    utr: { type: String },
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'cancelled', 'completed'],
    default: 'pending',
  },
  adminMessage: {
    type: String,
  },
  notes: {
    type: String,
  }
}, { timestamps: true });
export default mongoose.model('Subscription', subscriptionSchema);
