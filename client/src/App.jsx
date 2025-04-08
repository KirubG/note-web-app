import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import ReadNote from "./pages/home/ReadNote";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/read/:noteId", // This must match EXACTLY what you use in navigation
    element: <ReadNote />,
  },
  {
    path: "*",
    element: (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold font-poppins">
          404 - Page Not Found
        </h1>
      </div>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
