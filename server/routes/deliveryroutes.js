import express from 'express';
import { authorize, protect } from '../middlewear/authmiddlewear.js';
import { Alldeliveries, getUserDeliveries } from '../controllers/deliverycontroller.js';


const router = express.Router();
router.get('/admin/all', protect,authorize('admin'), Alldeliveries);
router.get('/user/all', protect, getUserDeliveries);
// getUserDeliveries

export default router