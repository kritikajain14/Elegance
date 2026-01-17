import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
// router.post('/add', addToCart);
router.post('/add', (req, res, next) => {
  console.log('ROUTE HIT: /api/cart/add')
  next()
}, protect, addToCart)

router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);

export default router;