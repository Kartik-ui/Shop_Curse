import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

const userSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  isAdmin: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const updateSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).or('userName', 'email');

const adminUpdateSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20),
  email: Joi.string().email(),
  isAdmin: Joi.boolean(),
}).or('userName', 'email', 'isAdmin');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(32).required(),
});

const objectId = Joi.string().custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid Id format');
  }
  return value;
}, 'ObjectId Validation');

const addProductSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().min(5).max(50).required(),
  price: Joi.number().required(),
  category: objectId.required(),
  quantity: Joi.number().required(),
  brand: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  description: Joi.string().min(5).max(50),
  price: Joi.number(),
  category: objectId,
  quantity: Joi.number(),
  brand: Joi.string(),
  image: Joi.string().custom((value, helpers) => {
    if (!value) return helpers.message('Image is not provided');
    return value;
  }),
}).or('name', 'description', 'price', 'category', 'quantity', 'brand', 'image');

const addProductReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().required(),
});

export {
  addProductReviewSchema,
  addProductSchema,
  adminUpdateSchema,
  createCategorySchema,
  loginSchema,
  updateProductSchema,
  updateSchema,
  userSchema,
};
