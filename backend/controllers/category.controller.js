import { isValidObjectId } from 'mongoose';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCategorySchema } from '../validations/validateSchema.js';

const createCategory = asyncHandler(async (req, res) => {
  const { value, error } = createCategorySchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);
  const { name } = value;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) throw new ApiError(400, 'Category already exists');

  const createCategory = await Category.create({ name });

  return res
    .status(201)
    .json(
      new ApiResponse(201, createCategory, 'Category created successfully')
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId))
    throw new ApiError(400, 'Invalid category Id');

  const { value, error } = createCategorySchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);
  const { name } = value;

  const modifiedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: { name },
    },
    { new: true }
  );

  if (!modifiedCategory) throw new ApiError(404, 'No category found');

  return res
    .status(200)
    .json(
      new ApiResponse(200, modifiedCategory, 'Category updated successfully')
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId))
    throw new ApiError(400, 'Invalid category Id');

  const deletedCategory = await Category.findByIdAndDelete(categoryId);

  if (!deletedCategory) throw new ApiError(404, 'No category found');

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedCategory, 'Category deleted successfully')
    );
});

const getCategories = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({});

  if (!allCategories) throw new ApiError(404, 'No category found');

  return res
    .status(200)
    .json(
      new ApiResponse(200, allCategories, 'Categories fetched successfully')
    );
});

const readCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId))
    throw new ApiError(400, 'Invalid category Id');

  const category = await Category.findById(categoryId);

  if (!category) throw new ApiError(404, 'No category found');

  return res
    .status(200)
    .json(new ApiResponse(200, category, 'Category fetched successfully'));
});

export {
  createCategory,
  deleteCategory,
  getCategories,
  readCategory,
  updateCategory,
};
