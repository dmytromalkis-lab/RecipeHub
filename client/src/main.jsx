import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/Auth/LoginPageOld.jsx";
import RegisterPage from "./Pages/Auth/RegisterPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import ProfileEditPage from "./Pages/Profile/ProfileEditPage.jsx";
import MainPage from "./Pages/Main/MainPage.jsx";
import Layout from "./Layout.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: false, path: '/', element: <MainPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/edit', element: <ProfileEditPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
