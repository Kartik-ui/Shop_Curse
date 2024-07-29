import express from 'express';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  loginUser,
  logoutUser,
  updateCurrentUser,
  updateUserById,
} from '../controllers/user.controller.js';
import { authorizeAdmin, verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(verifyJWT, authorizeAdmin, getAllUsers);

router.route('/create').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(verifyJWT, logoutUser);

router
  .route('/profile')
  .get(verifyJWT, getCurrentUserProfile)
  .put(verifyJWT, updateCurrentUser);

// Admin Routes
router
  .route('/:userId')
  .delete(verifyJWT, authorizeAdmin, deleteUserById)
  .get(verifyJWT, authorizeAdmin, getUserById)
  .patch(verifyJWT, authorizeAdmin, updateUserById);

export default router;
