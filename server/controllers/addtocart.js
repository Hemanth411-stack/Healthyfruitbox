import Cart from '../models/CartModel.js';
import Product from '../models/products.js';


export const addToCart = async (req, res) => {
  try {
    const { productId, productType, quantity = 1, addOnPrices = {} } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!productId || !productType) {
      return res.status(400).json({
        success: false,
        message: "Product ID and product type are required"
      });
    }

    // Validate product type
    if (!['fruitbox', 'juice'].includes(productType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product type. Must be 'fruitbox' or 'juice'"
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive"
      });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        notes: req.body.notes
      });
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      p => p.product.toString() === productId && p.productType === productType
    );

    if (existingProductIndex >= 0) {
      // Update existing product in cart
      const existingProduct = cart.products[existingProductIndex];
      existingProduct.quantity += quantity;
      
      // Merge add-ons (only for fruitbox)
      if (productType === 'fruitbox') {
        for (const [key, value] of Object.entries(addOnPrices)) {
          existingProduct.addOnPrices.set(key, 
            (existingProduct.addOnPrices.get(key) || 0) + value);
        }
      }
    } else {
      // Add new product to cart
      cart.products.push({
        product: productId,
        productType,
        quantity,
        basePrice: product.price,
        addOnPrices: productType === 'fruitbox' ? new Map(Object.entries(addOnPrices)) : new Map()
      });
    }

    // Update notes if provided
    if (req.body.notes) cart.notes = req.body.notes;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('products.product', 'name price description image');

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { products: [], totalPrice: 0 }
      });
    }

    // Transform the cart and strip unwanted Mongoose internals
    const transformedCart = {
      ...cart.toObject(), // this strips mongoose meta from cart
      products: cart.products.map(p => {
        const plainProduct = p.toObject(); // remove mongoose internals from each product
        return {
          ...plainProduct,
          addOnPrices: Object.fromEntries(
            Object.entries(plainProduct.addOnPrices || {})
          )
        };
      })
    };

    res.status(200).json({
      success: true,
      data: transformedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find and delete the cart
    const deletedCart = await Cart.findOneAndDelete({ user: userId });

    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
      data: deletedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete cart",
      error: error.message
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { productId, productType } = req.params;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // Filter out the product to remove
    const initialCount = cart.products.length;
    cart.products = cart.products.filter(
      p => !(p.product.toString() === productId && p.productType === productType)
    );

    // Check if product was actually removed
    if (cart.products.length === initialCount) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    // If cart is empty after removal, delete it
    if (cart.products.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        success: true,
        message: "Last item removed. Cart is now empty",
        data: null
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
      error: error.message
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, productType, quantity } = req.body;

    if (!productId || !productType) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and type are required.',
      });
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number greater than 0.',
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.',
      });
    }

    const productInCart = cart.products.find(
      p => p.product.toString() === productId && p.productType === productType
    );

    if (!productInCart) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart.',
      });
    }

    productInCart.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart quantity updated successfully.',
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart quantity.',
      error: error.message,
    });
  }
};
