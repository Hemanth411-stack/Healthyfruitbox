import express from 'express';
import { getalldeliveryboinames, getMyDeliveries, loginDeliveryBoy, registerDeliveryBoy, updateDeliveryStatus } from '../controllers/deliveryboicontroller.js';
import { protectDeliveryBoy } from '../middlewear/deliveryboi.js';
import { authorize, protect } from '../middlewear/authmiddlewear.js';
import { addToCart } from '../controllers/addtocart.js';



const router = express.Router();

router.post('/boi',registerDeliveryBoy)
router.post('/boi/login',loginDeliveryBoy)
router.get('/deliveryboi-address',protectDeliveryBoy,getMyDeliveries)
router.put('/delivery-update',protectDeliveryBoy,updateDeliveryStatus)
router.get('/delivery-details',protect, authorize('admin'),getalldeliveryboinames)

// add to cart
// router.post('/addtocart',protect,addToCart)
export default router;