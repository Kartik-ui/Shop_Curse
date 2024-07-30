import { isValidObjectId } from 'mongoose';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessAndRefreshTokens } from '../utils/generateTokens.js';
import {
  adminUpdateSchema,
  loginSchema,
  updateSchema,
  userSchema,
} from '../validations/validateSchema.js';

const createUser = asyncHandler(async (req, res) => {
  const { value, error } = userSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { email, userName, password } = value;

  const userExists = await User.findOne({ $or: [{ email }, { userName }] });

  if (userExists) throw new ApiError(400, 'User already exists');

  const newUser = await User.create({
    email,
    userName,
    password,
  });

  if (!newUser)
    throw new ApiError(500, 'Something went wrong while creating user');

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(newUser);

  const createdUser = await User.findById(newUser._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  return res
    .status(201)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(201, createdUser, 'User created successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);
  const { email, password } = value;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No user found');

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(404, 'Invalid user credentials');

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, 'User loggedIn successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, { $unset: { refreshToken: 1 } });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, 'User logged out'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) throw new ApiError(404, 'No users found');

  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'));
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(404, 'No user found');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { value, error } = updateSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { email, userName, password } = value;

  const modifiedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { userName, email, password },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, modifiedUser, 'User updated successfully'));
});

const deleteUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, 'Invalid user id');

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, 'No user found');

  if (user.isAdmin) throw new ApiError(400, "Can't delete admin users");

  await user.deleteOne({ runValidators: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User deleted successfully'));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, 'Invalid user id');

  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'No user found');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

const updateUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, 'Invalid user id');

  const { value, error } = adminUpdateSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { userName, email, isAdmin } = value;

  const modifiedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { userName, email, isAdmin },
    },
    { new: true }
  );

  if (!modifiedUser) throw new ApiError(404, 'No user found to update');

  return res
    .status(200)
    .json(new ApiResponse(200, modifiedUser, 'User updated successfully'));
});

export {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  loginUser,
  logoutUser,
  updateCurrentUser,
  updateUserById,
};
