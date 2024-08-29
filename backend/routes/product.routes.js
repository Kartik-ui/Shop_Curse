import express from 'express';
import {
  addProduct,
  addProductReview,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import { authorizeAdmin, verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(fetchProducts)
  .post(verifyJWT, authorizeAdmin, upload.single('image'), addProduct);

router
  .route('/:productId/reviews')
  .post(verifyJWT, authorizeAdmin, addProductReview);

router
  .route('/:productId')
  .get(fetchProductById)
  .put(verifyJWT, authorizeAdmin, upload.single('image'), updateProduct)
  .delete(verifyJWT, authorizeAdmin, deleteProduct);

export default router;
