import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetCategoriesQuery } from '../../redux/api/categoryApiSlice';
import {
  useCreateProductMutation,
  useCreateReviewMutation,
  useUpdateProductMutation,
} from '../../redux/api/productApiSlice';

const ProductList = () => {
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const [formData, setFormData] = useState({
    image: '',
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    brand: '',
    stock: '',
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleFormData = (e) => {
    const { name, value, files } = e.target;
    switch (name) {
      case 'image':
        return setFormData((prev) => ({ ...prev, [name]: files[0] }));
      default:
        return setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      for (const key in formData) {
        productData.append(key, formData[key]);
      }
      const response = await createProduct(productData).unwrap();
      toast.success(response.message);
      setImageUrl(response.data.image);
      navigate('/');
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  return (
    <section className="container sm:mx-[0] xl:mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        {/* AdminMenu */}
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

            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-5 rounded-lg bg-pink-600 px-10 py-4 text-lg font-bold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
