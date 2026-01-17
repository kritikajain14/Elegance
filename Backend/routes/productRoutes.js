import express from 'express';
import {
  getProducts,
  getProductById,
  getNewArrivals,
  getPopularProducts
} from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// Merge review routes
router.use('/:productId/reviews', reviewRoutes);

router.get('/', getProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/popular', getPopularProducts);
router.get('/:productId', getProductById);

export default router;