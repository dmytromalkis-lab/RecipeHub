import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./Pages/Auth/RegisterPage.jsx";
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import RecipeCreate from "./Pages/Recipe/RecipeCreate.jsx";
import RecipeEdit from "./Pages/Recipe/RecipeEdit.jsx";
import RecipeView from "./Pages/Recipe/RecipeView.jsx";
import ProfileEditPage from "./Pages/Profile/ProfileEditPage.jsx";
import MainPage from "./Pages/Main/MainPage.jsx";
import Layout from "./Layout.jsx";
import RequireAuth from "./Components/Auth/RequireAuth.jsx";
import Login from "./Pages/Auth/LoginPage.jsx";
import GoogleCallbackPage from "./Pages/Auth/GoogleCallbackPage.jsx";
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import RequireUser from "./Components/Auth/RequireUser.jsx";
import NotFoundPage from "./Pages/Error/NotFoundPage/NotFoundPage.jsx";
import ForbiddenPage from "./Pages/Error/Forbidden/ForbiddenPage.jsx";
import RequireAdmin from "./Components/Auth/RequireAdmin.jsx";
import SearchingPage from "./Pages/Searching/SearchingPage.jsx";


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
      { path: "/recipe/create", element: <RequireUser> <RecipeCreate /> </RequireUser> },
    { path: "/recipe/:id/edit", element: <RequireUser> <RecipeEdit /> </RequireUser> },
      { path: "/search", element: <RequireUser> <SearchingPage /> </RequireUser> },
  { path: "/recipe/:id", element: <RecipeView /> },
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
