import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import App from '../App';
import CategoryList from '../pages/admin/CategoryList';
import UserList from '../pages/admin/UserList';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/user/Profile';
import AdminRoutes from './AdminRoutes';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
      </Route>
    </Route>
  )
);

export { router };
