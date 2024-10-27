import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`${isMenuOpen ? 'right-2 top-2' : 'right-7 top-5'} fixed rounded-lg bg-[#151515] p-2`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="my-1 h-1 w-6 bg-white"></div>
            <div className="my-1 h-1 w-6 bg-white"></div>
            <div className="my-1 h-1 w-6 bg-white"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="fixed right-7 top-5 bg-[#151515] p-4">
          <ul className="mt-2 list-none">
            <li>
              <NavLink
                className="mb-5 list-item rounded-sm px-3 py-2 hover:bg-[#2E2D2D]"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? 'greenyellow' : 'white',
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="mb-5 list-item rounded-sm px-3 py-2 hover:bg-[#2E2D2D]"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? 'greenyellow' : 'white',
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="mb-5 list-item rounded-sm px-3 py-2 hover:bg-[#2E2D2D]"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? 'greenyellow' : 'white',
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="mb-5 list-item rounded-sm px-3 py-2 hover:bg-[#2E2D2D]"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? 'greenyellow' : 'white',
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="mb-5 list-item rounded-sm px-3 py-2 hover:bg-[#2E2D2D]"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? 'greenyellow' : 'white',
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="mb-5 list-item rounded-sm px-3 py-2 hover:bg-[#2E2D2D]"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? 'greenyellow' : 'white',
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
