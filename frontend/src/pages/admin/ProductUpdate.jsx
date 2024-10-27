import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetCategoriesQuery } from '../../redux/api/categoryApiSlice';
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '../../redux/api/productApiSlice';
import AdminMenu from './AdminMenu';

const ProductUpdate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data } = useGetProductByIdQuery(params._id);
  const productData = data?.data;
  const { data: categories } = useGetCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    quantity: 0,
    brand: '',
    stock: 0,
    image: '',
  });
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (productData?._id) {
      setFormData((prev) => ({
        ...prev,
        name: productData?.name,
        description: productData?.description,
        price: productData?.price,
        category: productData?.category?._id,
        quantity: productData?.quantity,
        brand: productData?.brand,
        stock: productData?.countInStock,
      }));
      setImageUrl(productData?.image);
    }
  }, [productData]);

  console.log('formData', formData);

  const handleFormData = (e) => {
    const { name, value, files } = e.target;
    switch (name) {
      case 'image':
        return setFormData((prev) => ({ ...prev, [name]: files[0] }));
      default:
        return setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'image' && !formData[key]) return;
      if (
        formData[key] !== null &&
        formData[key] !== '' &&
        formData[key] !== undefined
      ) {
        data.append(key, formData[key]);
      }
    });
    try {
      const response = await updateProduct({
        productId: productData?._id,
        formData: data,
      }).unwrap();
      toast.success(response.message);
      navigate('/admin/allproductslist');
    } catch (error) {
      toast.error(error.message || error.data.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      let answer = window.confirm(
        'Are you sure you want to delete this product?'
      );
      if (!answer) return;
      const response = await deleteProduct(productData?._id).unwrap();
      toast.success(response.message);
      navigate('/admin/allproductslist');
    } catch (error) {
      toast.error(error.message || error.data.message);
    }
  };

  return (
    <section className="container sm:mx-[0] xl:mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="p-3 md:w-3/4">
          <div className="h-12">Create Product</div>
          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="mx-auto block max-h-[12.5rem]"
              />
            </div>
          )}
          <div className="mb-3">
            <label
              htmlFor="image"
              className="block w-full cursor-pointer rounded-lg border px-4 py-11 text-center font-bold text-white"
            >
              {formData.image ? formData.image.name : 'Upload Image'}
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleFormData}
                className={!formData.image ? 'hidden' : 'text-white'}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div>
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mb-3 w-[30rem] rounded-lg border bg-[#101011] p-4 text-white"
                  value={formData.name}
                  onChange={handleFormData}
                />
              </div>
              <div className="ml-10">
                <label htmlFor="price">Price</label> <br />
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="mb-3 w-[30rem] rounded-lg border bg-[#101011] p-4 text-white"
                  value={formData.price}
                  onChange={handleFormData}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div>
                <label htmlFor="quantity">Quantity</label> <br />
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="mb-3 w-[30rem] rounded-lg border bg-[#101011] p-4 text-white"
                  value={formData.quantity}
                  onChange={handleFormData}
                />
              </div>
              <div className="ml-10">
                <label htmlFor="brand">Brand</label> <br />
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  className="mb-3 w-[30rem] rounded-lg border bg-[#101011] p-4 text-white"
                  value={formData.brand}
                  onChange={handleFormData}
                />
              </div>
            </div>

            <label htmlFor="description" className="my-5">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="mb-3 w-[95%] rounded-lg border bg-[#101011] p-2 text-white"
              value={formData.description}
              onChange={handleFormData}
            ></textarea>

            <div className="flex flex-wrap">
              <div>
                <label htmlFor="stock">Count In Stock</label> <br />
                <input
                  type="text"
                  name="stock"
                  id="stock"
                  className="mb-3 w-[30rem] rounded-lg border bg-[#101011] p-4 text-white"
                  value={formData.stock}
                  onChange={handleFormData}
                />
              </div>
              <div className="ml-10">
                <label htmlFor="category">Category</label> <br />
                <select
                  name="category"
                  id="category"
                  className="mb-3 w-[30rem] rounded-lg border bg-[#101011] p-4 text-white"
                  value={formData.category}
                  onChange={handleFormData}
                >
                  <option value={null} defaultChecked>
                    Choose Category
                  </option>
                  {categories?.data?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <button
                type="submit"
                onClick={handleUpdate}
                className="mr-6 mt-5 rounded-lg bg-green-600 px-10 py-4 text-lg font-bold"
              >
                Update
              </button>
              <button
                type="submit"
                onClick={handleDelete}
                className="mt-5 rounded-lg bg-pink-600 px-10 py-4 text-lg font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductUpdate;
