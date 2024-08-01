import Joi from 'joi';

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

export { adminUpdateSchema, loginSchema, updateSchema, userSchema };
