import { PRODUCT_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, sort }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword, sort },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: 'PUT',
        body: formData,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useCreateReviewMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
  use,
} = productApiSlice;
