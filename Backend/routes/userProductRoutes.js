import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProductById,
  getUserDashboardStats,
  updateProductImages,
  deleteProductImage,
  activateProduct
} from '../controllers/userProductController.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.use(protect);

router.get('/dashboard/stats', getUserDashboardStats);
router.get('/products', getUserProducts);
router.get('/products/:id', getUserProductById);
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id/images', upload.array('images', 5), updateProductImages);
router.delete('/products/:id/images/:imageIndex', deleteProductImage);
router.put('/products/:productId/activate', activateProduct);


export default router;