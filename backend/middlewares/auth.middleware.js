import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) throw new ApiError(401, 'Unauthorized request');

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken'
  );

  if (!user) throw new ApiError(401, 'Invalid Access Token');

  req.user = user;
  next();
});

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }
  throw new ApiError(401, 'Not authorized as Admin');
});

export { authorizeAdmin, verifyJWT };
