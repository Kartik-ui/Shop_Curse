import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Loader from '../components/Loader';

const App = () => import('../App');
const Login = () => import('../pages/auth/Login');
const Register = () => import('../pages/auth/Register');

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      lazy={async () => {
        const module = await App();
        return { Component: module.default, fallback: <Loader /> };
      }}
    >
      <Route
        path="/login"
        lazy={async () => {
          const module = await Login();
          return { Component: module.default, fallback: <Loader /> };
        }}
      />
      <Route
        path="/register"
        lazy={async () => {
          const module = await Register();
          return { Component: module.default, fallback: <Loader /> };
        }}
      />
    </Route>
  )
);

export { router };
