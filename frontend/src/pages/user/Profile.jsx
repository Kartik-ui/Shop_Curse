import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useProfileMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useProfileMutation();

  const [formData, setFormData] = useState({
    userName: userInfo?.data?.userName,
    email: userInfo?.data?.email,
    password: '',
    confirmPassword: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, userName } = formData;
    const data = new URLSearchParams();

    if (email) data.append('email', email);
    if (userName) data.append('userName', userName);
    if (password) data.append('password', password);

    if (password && password !== confirmPassword)
      return toast.error('Passwords do not match');
    try {
      const res = await updateProfile(data).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(res.message);
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  return (
    <section className="container mx-auto mt-[7rem] p-4">
      <div className="flex items-center justify-center md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="mb-4 text-2xl font-semibold">Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="userName" className="mb-2 block text-white">
                Name
              </label>
              <input
                type="text"
                name="userName"
                id="userName"
                placeholder="Enter name"
                className="w-full rounded border p-2"
                value={formData.userName}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userName" className="mb-2 block text-white">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email address"
                className="w-full rounded border p-2"
                value={formData.email}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userName" className="mb-2 block text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                className="w-full rounded border p-2"
                value={formData.password}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userName" className="mb-2 block text-white">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm password"
                className="w-full rounded border p-2"
                value={formData.confirmPassword}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
              >
                Update
              </button>
              <Link
                to="/user-orders"
                className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
              >
                My Orders
              </Link>
            </div>
          </form>
        </div>
        {isLoading && <Loader />}
      </div>
    </section>
  );
};

export default Profile;
