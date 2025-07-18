import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema({
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
    default: 1,
    min: 1
  },
  basePrice: {
    type: Number,
    required: true
  },
  addOnPrices: {
    type: Map,
    of: Number,
    default: {}
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [cartProductSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Calculate total price before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.products.reduce((total, product) => {
    const addOnsTotal = [...product.addOnPrices.values()].reduce((sum, price) => sum + price, 0);
    return total + (product.basePrice * product.quantity) + addOnsTotal;
  }, 0);
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Cart', cartSchema);