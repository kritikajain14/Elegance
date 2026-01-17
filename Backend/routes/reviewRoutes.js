import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addReview,
  getProductReviews,
  markReviewHelpful,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getProductReviews)
  .post(protect, addReview);

router.route('/:reviewId/helpful')
  .put(protect, markReviewHelpful);

router.route('/:reviewId')
  .delete(protect, deleteReview);

export default router;