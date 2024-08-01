import { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../redux/api/usersApiSlice';

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    userId: null,
    userName: '',
    email: '',
  });
  console.log(formData);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateHandler = async (userId) => {
    try {
      const { email, userName } = formData;
      const res = await updateUser({ userId, userName, email }).unwrap();
      setFormData((prev) => ({ ...prev, userId: null }));
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  const toggleEdit = (user) => {
    setFormData((prev) => ({
      ...prev,
      email: user?.email,
      userName: user?.userName,
      userId: user?._id,
    }));
  };

  const deleteHandler = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        const res = await deleteUser(userId).unwrap();
        toast.success(res.message);
        refetch();
      } catch (error) {
        toast.error(error.data.message || error.message);
      }
    }
  };

  return (
    <section className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error?.message}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* TODO: <AdminMenu />  */}
          <table className="mx-auto w-full md:w-4/5">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {users?.data?.map((user) => (
                <tr key={user?._id}>
                  <td className="px-4 py-2">{user?._id}</td>
                  <td className="px-4 py-2">
                    {formData.userId === user?._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="userName"
                          id="userName"
                          className="w-full rounded-lg border p-2"
                          value={formData.userName}
                          onChange={handleFormChange}
                        />
                        <button
                          onClick={() => updateHandler(user?._id)}
                          className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p>{user?.userName}</p>
                        <button onClick={() => toggleEdit(user)}>
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {formData.userId === user?._id ? (
                      <div className="flex items-center">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="w-full rounded-lg border p-2"
                          value={formData.email}
                          onChange={handleFormChange}
                        />
                        <button
                          onClick={() => updateHandler(user?._id)}
                          className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p>{user?.email}</p>
                        <button onClick={() => toggleEdit(user)}>
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user?.isAdmin ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!user?.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user?._id)}
                          className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserList;
