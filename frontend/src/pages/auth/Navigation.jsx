import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logout } from '../../redux/features/auth/authSlice';
import './Navigation.css';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [showSidebar, setShowSidebar] = useState(false);
  const showSidebar = false;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      className={`z-[999] ${showSidebar ? 'hidden' : 'flex'} fixed hidden h-[100vh] w-[4%] flex-col justify-between bg-black p-4 text-white hover:w-[15%] lg:flex`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex transform items-center transition-transform hover:translate-x-2"
        >
          <AiOutlineHome size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name mt-[3rem] hidden">HOME</span>
        </Link>
        <Link
          to="/shop"
          className="flex transform items-center transition-transform hover:translate-x-2"
        >
          <AiOutlineShopping size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name mt-[3rem] hidden">SHOP</span>
        </Link>
        <Link
          to="/cart"
          className="flex transform items-center transition-transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name mt-[3rem] hidden">CART</span>
        </Link>
        <Link
          to="/favorite"
          className="flex transform items-center transition-transform hover:translate-x-2"
        >
          <FaHeart size={26} className="mr-2 mt-[3rem]" />
          <span className="nav-item-name mt-[3rem] hidden">Favorite</span>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo?.data?.userName}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 h-4 w-4 ${
                dropdownOpen ? 'rotate-360 transform' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          )}
        </button>
        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mr-14 mt-2 space-y-2 bg-white text-gray-600 ${userInfo?.data?.isAdmin ? '-top-80' : '-top-20'}`}
          >
            {userInfo?.data?.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            <li>
              <Link
                onClick={logoutHandler}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </Link>
            </li>
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex transform items-center transition-transform hover:translate-x-2"
            >
              <AiOutlineLogin size={26} className="mr-2 mt-[3rem]" />
              <span className="nav-item-name mt-[3rem] hidden">Login</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex transform items-center transition-transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} className="mr-2 mt-[3rem]" />
              <span className="nav-item-name mt-[3rem] hidden">Register</span>
            </Link>
          </li>
        </ul>
      )}
    </section>
  );
};

export default Navigation;
