import express from 'express';
import {  authorize, protect } from '../middlewear/authmiddlewear.js';
import  { updateSubscriptionStatus,subscriptionController, getUserSubscriptionStats, getallSubscriptions, } from '../controllers/Subscriptioncontroller.js';
import { addToCart, getCart, removeItemFromCart, updateCartQuantity } from '../controllers/addtocart.js';


const router = express.Router();

router.post('/', protect, subscriptionController.createSubscription); 
router.get('/me', protect, getUserSubscriptionStats);
router.get("/admin/all", protect, authorize('admin'), getallSubscriptions);
router.put("/update-status", protect, authorize('admin'), updateSubscriptionStatus);
// router.delete('/admin-delete-subscription',protect,authorize('admin'),deleteSubscriptionAndDeliveries)

// add to cart
router.post('/addtocart',protect,addToCart)
router.get('/cart',protect,getCart)
router.put('/update-cart',protect,updateCartQuantity)
router.delete('/cart/:productId/:productType', protect, removeItemFromCart);
export default router;
