import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  readCategory,
  updateCategory,
} from '../controllers/category.controller.js';
import { authorizeAdmin, verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(verifyJWT, authorizeAdmin, createCategory);

router
  .route('/:categoryId')
  .get(readCategory)
  .put(verifyJWT, authorizeAdmin, updateCategory)
  .delete(verifyJWT, authorizeAdmin, deleteCategory);

export default router;
