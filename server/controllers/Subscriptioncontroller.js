
import Delivery from "../models/Delilvery.js";
import User from "../models/User.js";
import Userinformation from "../models/Userinformation.js";
import Product from "../models/products.js"
import Subscription from "../models/subscription.js";
import Cart from "../models/CartModel.js"

export const updateSubscriptionStatus = async (req, res) => {
  try {
    
    const { status, paymentStatus, subscriptionId } = req.body;

    // Validate input
    if (!subscriptionId) {
      return res.status(400).json({ message: 'Subscription ID is required' });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Prepare updates
    const updates = {};
    if (status && ['active', 'pending', 'cancelled', 'completed'].includes(status)) {
      updates.status = status;
    }
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }

    // Update subscription
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      updates,
      { new: true }
    );

    // Schedule deliveries ONLY if status changed to 'active'
    if (status === 'active' && subscription.status !== 'active') {
      try {
        await scheduleAllDeliveriesForSubscription(subscriptionId);
      } catch (deliveryError) {
        console.error('Delivery scheduling failed:', deliveryError);
        // Rollback status if delivery creation fails
        await Subscription.findByIdAndUpdate(
          subscriptionId,
          { status: subscription.status }, // Revert to original status
          { new: true }
        );
        return res.status(500).json({
          success: false,
          message: 'Status update failed: Could not schedule deliveries',
          error: deliveryError.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message
    });
  }
};

export const subscriptionController = {
  /**
   * Create a new subscription with automatic end date calculation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createSubscription(req, res) {
    try {
      const {
        cartId, // Optional: if you want to specify which cart to use
        paymentMethod,
        paymentProof,
        adminMessage,
        notes,
        startDate // Optional custom start date
      } = req.body;
      
      const user = req.user.id; // Extracted from authenticated user

      // Validate required fields
      if (!user || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: paymentMethod'
        });
      }

      // Validate user exists
      const userExists = await User.findById(user);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get user's cart (without status check)
      let cart;
      if (cartId) {
        // If specific cart ID is provided
        cart = await Cart.findOne({ _id: cartId, user: user });
      } else {
        // Get the most recent cart
        cart = await Cart.findOne({ user: user }).sort({ createdAt: -1 });
      }

      if (!cart || !cart.products || cart.products.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No cart with products found for this user'
        });
      }

      // Calculate dates (1 month subscription)
      const startDateObj = startDate ? new Date(startDate) : new Date();
      if (isNaN(startDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid startDate format'
        });
      }
      
      const endDateObj = new Date(startDateObj);
      endDateObj.setMonth(endDateObj.getMonth() + 1);

      // Use products from cart and calculate total price
      let totalPrice = 0;
      const validatedProducts = [];

      for (const cartItem of cart.products) {
        // Validate product exists
        const product = await Product.findById(cartItem.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found with ID: ${cartItem.product}`
          });
        }

        // Validate product type
        if (!['fruitbox', 'juice'].includes(cartItem.productType)) {
          return res.status(400).json({
            success: false,
            message: `Invalid productType for product ${cartItem.product}. Must be 'fruitbox' or 'juice'`
          });
        }

        // Validate base price
        if (typeof cartItem.basePrice !== 'number' || cartItem.basePrice <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid basePrice for product ${cartItem.product}. Must be a positive number`
          });
        }

        // Validate quantity
        const quantity = cartItem.quantity || 1;
        if (quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid quantity for product ${cartItem.product}. Must be at least 1`
          });
        }

        // Validate addOnPrices if product is fruitbox
        let addOnPrices = {};
        if (cartItem.productType === 'fruitbox') {
          if (cartItem.addOnPrices instanceof Map) {
            for (const [key, value] of cartItem.addOnPrices.entries()) {
              if (typeof value !== 'number' || value < 0) {
                return res.status(400).json({
                  success: false,
                  message: `Invalid addOnPrice for ${key} in product ${cartItem.product}. Must be a non-negative number`
                });
              }
              addOnPrices[key] = value;
            }
          } else if (cartItem.addOnPrices && typeof cartItem.addOnPrices === 'object') {
            for (const [key, value] of Object.entries(cartItem.addOnPrices)) {
              // Skip internal Mongoose properties
              if (key.startsWith('$')) continue;
              
              if (typeof value !== 'number' || value < 0) {
                return res.status(400).json({
                  success: false,
                  message: `Invalid addOnPrice for ${key} in product ${cartItem.product}. Must be a non-negative number`
                });
              }
              addOnPrices[key] = value;
            }
          }
        }

        // Calculate product total
        const productTotal = (cartItem.basePrice * quantity) + 
          Object.values(addOnPrices).reduce((sum, price) => sum + price, 0);

        totalPrice += productTotal;

        validatedProducts.push({
          product: cartItem.product,
          productType: cartItem.productType,
          quantity,
          basePrice: cartItem.basePrice,
          addOnPrices
        });
      }

      // Validate payment method
      if (!['COD', 'PhonePe'].includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: "Invalid paymentMethod. Must be 'COD' or 'PhonePe'"
        });
      }

      // Set payment status based on method
      let paymentStatus = 'pending';
      if (paymentMethod === 'PhonePe' && paymentProof && paymentProof.utr) {
        paymentStatus = 'awaiting_approval';
      }

      // Create the subscription
      const newSubscription = new Subscription({
        user,
        products: validatedProducts,
        startDate: startDateObj,
        endDate: endDateObj,
        totalPrice,
        paymentMethod,
        paymentStatus,
        paymentProof: paymentMethod === 'PhonePe' ? paymentProof : undefined,
        adminMessage,
        notes,
        status: 'pending'
      });

      const savedSubscription = await newSubscription.save();

      // Optionally delete the cart after creating subscription
      await Cart.findByIdAndDelete(cart._id);

      return res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        data: savedSubscription
      });

    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

const scheduleAllDeliveriesForSubscription = async (subscriptionId) => {
  try {
    const subscription = await Subscription.findById(subscriptionId)
      .populate('user')
      .populate('products.product');
    
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.status === 'cancelled') return;

    const userInfo = await Userinformation.findOne({ user: subscription.user._id });
    if (!userInfo) throw new Error('User information not found');

    const deliveryData = {
      user: subscription.user._id,
      subscription: subscription._id,
      address: userInfo.address,
      slot: userInfo.slot || 'morning 6AM - 8AM',
      products: subscription.products.map(p => ({
        product: p.product._id,
        productType: p.productType,
        quantity: p.quantity,
        basePrice: p.basePrice
      })),
      status: 'pending',
      isFestivalOrSunday: false
    };

    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const currentDate = new Date(startDate);

    // Process each date without skipping any
    while (currentDate <= endDate) {
      // Only create delivery if NOT Sunday
      if (currentDate.getDay() !== 0) { // 0 = Sunday
        const existingDelivery = await Delivery.findOne({
          subscription: subscription._id,
          deliveryDate: currentDate
        });

        if (!existingDelivery) {
          await Delivery.create({
            ...deliveryData,
            deliveryDate: new Date(currentDate)
          });
        }
      }
      // Always move to next date (even if it's Sunday)
      currentDate.setDate(currentDate.getDate() + 1);
    }

  } catch (error) {
    console.error('Error in scheduleAllDeliveriesForSubscription:', error);
    throw error;
  }
};

export const getUserSubscriptionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all subscriptions of the user
    const subscriptions = await Subscription.find({ user: userId }).populate({
        path: 'products.product',  // Correct path to populate the product reference
        select: 'name description price'  // Select specific fields you need
      });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    console.error('Failed to get user subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription data',
      error: error.message
    });
  }
};

export const getallSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate({
        path: 'products.product',  // Correct path to populate the product reference
        select: 'name description price'  // Select specific fields you need
      })
      .populate('user', 'name email')  // Populate user with name and email
      .lean();  // Convert to plain JavaScript objects for better performance

    // Optional: Transform the data for better frontend consumption
    const transformedSubs = subs.map(sub => ({
      ...sub,
      products: sub.products.map(p => ({
        ...p,
        productName: p.product?.name || 'Unknown Product',
        productDescription: p.product?.description || '',
        productPrice: p.product?.price || 0
      }))
    }));

    res.json(transformedSubs);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch subscriptions', 
      error: error.message 
    });
  }
};