import mongoose from "mongoose";

const deliveryProductSchema = new mongoose.Schema({
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
  }
}, { _id: false });

const deliverySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  address: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    googleMapLink: { type: String },
  },
  slot: {
    type: String,
    default: 'morning 6AM - 8AM'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  products: [deliveryProductSchema], // Array of products
  status: {
    type: String,
    enum: ['pending', 'delivered', 'missed'],
    default: 'pending'
  },
  isFestivalOrSunday: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Delivery', deliverySchema);
