import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/productcontroller.js';
const router = express.Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected Routes (for Admin)
router.post('/',createProduct);
// pending 
// router.put('/:id', protect, updateProduct);
// router.delete('/:id', protect, deleteProduct);

export default router;
