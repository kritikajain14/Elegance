import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  getSellerPublicProfile,
  getSellerProducts
} from '../controllers/userProfileController.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Public routes
router.get('/sellers/:userId', getSellerPublicProfile);
router.get('/sellers/:userId/products', getSellerProducts);

// Protected routes
router.use(protect);
router.get('/profile', getUserProfile);
router.put('/profile',protect, updateUserProfile);

export default router;