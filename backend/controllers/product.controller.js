import { isValidObjectId } from 'mongoose';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import {
  addProductReviewSchema,
  addProductSchema,
  updateProductSchema,
} from '../validations/validateSchema.js';

const addProduct = asyncHandler(async (req, res) => {
  const { value, error } = addProductSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { name, description, price, category, quantity, brand, stock } = value;

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) throw new ApiError(400, 'Image is required');

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) throw new ApiError(400, 'Product already exists');

  const imageUrl = await uploadOnCloudinary(imageLocalPath);

  const product = await Product.create({
    name,
    description,
    price,
    category,
    quantity,
    brand,
    image: imageUrl?.url,
    countInStock: stock,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId))
    throw new ApiError(400, 'Invalid product Id');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'No product found to update');

  const oldImageUrl = product.image;

  if (req.file && req.file.path) {
    req.body.image = req.file.path;
  }

  const { value, error } = updateProductSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  Object.assign(product, value);

  if (req.file && req.file.path) {
    const newImageUrl = (await uploadOnCloudinary(req.file.path)).url;
    product.image = newImageUrl;
  }

  await product.save({ validateModifiedOnly: true });

  if (req.file && req.file.path) {
    await deleteOnCloudinary(oldImageUrl, 'image');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId))
    throw new ApiError(400, 'Invalid product Id');

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) throw new ApiError(404, 'No product found to delete');

  return res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, 'Product deleted successfully'));
});

const fetchProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6, keyword = '', sort = 'createdAt' } = req.query;

  const query = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

  const products = await Product.paginate(query, {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      docs: 'products',
      totalDocs: 'totalProducts',
    },
    sort,
    populate: [
      { path: 'category' },
      {
        path: 'reviews',
        // populate: { path: 'user', select: 'userName email' },
      },
    ],
  });

  if (!products.products.length) throw new ApiError(404, 'No products found');

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products fetched successfully'));
});

const fetchProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId))
    throw new ApiError(400, 'Invalid product Id');

  const product = await Product.findById(productId).populate([
    { path: 'category' },
    {
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'userName email',
      },
    },
  ]);

  if (!product) throw new ApiError(404, 'No product found');

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched successfully'));
});

const addProductReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId))
    throw new ApiError(400, 'Invalid product Id');

  const { value, error } = addProductReviewSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { rating, comment } = value;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'No product found');

  const alreadyReviewed = product.reviews.find(
    (item) => item.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) throw new ApiError(400, 'Product already reviewed');

  const review = {
    name: req.user.userName,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
    product.numReviews;

  await product.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product review added'));
});

export {
  addProduct,
  addProductReview,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
};
