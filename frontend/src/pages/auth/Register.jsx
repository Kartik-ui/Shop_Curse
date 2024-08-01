import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useRegisterMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return toast.error('Passwords do not match');
    try {
      const { userName, email, password } = formData;
      const res = await register({ userName, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(register);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  return (
    <section className="flex flex-wrap pl-[10rem]">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="mb-4 text-2xl font-semibold">Register</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          <div className="my-[2rem]">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Enter name"
              className="mt-1 w-full rounded border p-2"
              value={formData.userName}
              onChange={handleFormChange}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email address"
              className="mt-1 w-full rounded border p-2"
              value={formData.email}
              onChange={handleFormChange}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              className="mt-1 w-full rounded border p-2"
              value={formData.password}
              onChange={handleFormChange}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Enter confirm password"
              className="mt-1 w-full rounded border p-2"
              value={formData.confirmPassword}
              onChange={handleFormChange}
            />
          </div>
          <button
            disabled={isLoading}
            className="my-[1rem] cursor-pointer rounded bg-pink-500 px-4 py-2 text-white"
            type="submit"
          >
            {isLoading ? 'Registering...' : 'Register'}
            {isLoading && <Loader />}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt=""
        className="h-[65rem] w-[59%] rounded-lg sm:hidden md:hidden xl:block"
      />
    </section>
  );
};

export default Register;
