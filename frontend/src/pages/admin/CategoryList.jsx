import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CategoryForm from '../../components/CategoryForm';
import Modal from '../../components/Modal';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '../../redux/api/categoryApiSlice';

const CategoryList = () => {
  const { data: categories, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [modalVisible, setModalVisible] = useState('');

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await createCategory({ name }).unwrap();
      setName('');
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const res = await deleteCategory({
        categoryId: selectedCategory._id,
      }).unwrap();
      refetch();
      toast.success(res.message);
      setModalVisible(false);
      setSelectedCategory(null);
      setUpdateName('');
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  const handleUpdateCategory = async (e) => {
    console.log('update clicked');
    e.preventDefault();
    try {
      const res = await updateCategory({
        categoryId: selectedCategory._id,
        name: updateName,
      }).unwrap();
      refetch();
      toast.success(res.message);
      setModalVisible(false);
      setSelectedCategory(null);
      setUpdateName('');
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  return (
    <section className="ml-[10rem] flex flex-col md:flex-row">
      {/* <AdminMenu /> */}
      <div className="p-3 md:w-3/4">
        <div className="h-12">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          buttonText="Submit"
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.data?.map((category) => (
            <button
              key={category?._id}
              className="focus:ring-ping-500 m-3 rounded-lg border border-pink-500 bg-white px-4 py-2 text-pink-500 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdateName(category?.name);
              }}
            >
              {category?.name}
            </button>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updateName}
            setValue={setUpdateName}
            handleSubmit={handleUpdateCategory}
            handleDelete={handleDeleteCategory}
            buttonText="Update"
          />
        </Modal>
      </div>
    </section>
  );
};

export default CategoryList;
