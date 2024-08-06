import { CATEGORY_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, name }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: 'PUT',
        body: { name },
      }),
    }),
    deleteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: 'DELETE',
      }),
    }),
    readCategory: builder.query({
      query: (data) => ({
        url: `${CATEGORY_URL}/${data.categoryId}`,
      }),
    }),
    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}`,
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useReadCategoryQuery,
  useUpdateCategoryMutation,
} = categoryApiSlice;
