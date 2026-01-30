import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  createOrder,
  getUserOrders,
  getOrderById,
  getStripeConfig,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

router.use(protect);

router.post('/create-payment-intent', createPaymentIntent);
router.post('/create-order', createOrder);
router.get('/orders', getUserOrders);
router.get('/orders/:id', getOrderById);

export default router;