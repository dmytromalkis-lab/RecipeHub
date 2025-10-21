import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import ProfileEditPage from "./Pages/Profile/ProfileEditPage.jsx";
import MainPage from "./Pages/Main/MainPage.jsx";
import Layout from "./Layout.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";
import Login from "./pages/Auth/LoginPage.jsx";
import GoogleCallbackPage from "./pages/Auth/GoogleCallbackPage.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import RequireUser from "./components/Auth/RequireUser.jsx";
import NotFoundPage from "./pages/Error/NotFoundPage/NotFoundPage.jsx";
import ForbiddenPage from "./pages/Error/Forbidden/ForbiddenPage.jsx";
import RequireAdmin from "./components/Auth/RequireAdmin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: false, path: "/", element: <MainPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <Login /> },
      { path: "/auth/google/callback", element: <GoogleCallbackPage /> },
      { path: "/profile", element: <RequireUser> <ProfilePage /> </RequireUser> },
      { path: "/profile/:id", element: <RequireUser> <ProfilePage /> </RequireUser> },
      { path: "/profile/edit", element: <RequireUser> <ProfileEditPage /> </RequireUser> },
    ],
  },
  {path: "/admin", element: <RequireAdmin> <AdminLayout/> </RequireAdmin>, children: []},
  { path: "*", element: <NotFoundPage /> },
  { path: "403", element: <ForbiddenPage />},
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
