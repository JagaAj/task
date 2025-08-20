import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout.js";
import Home from "./pages/Home.js";
import ProductList from "./components/ProductList.js";
import Categories from "./components/Categories.js";
import ProductDetails from "./components/ProductDetails.js";
import AddProduct from "./components/AddProduct.js";
import UpdateProduct from "./components/UpdateProduct.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "product", element: <ProductList /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "categories", element: <Categories /> },
      { path: "/add_product", element: <AddProduct /> },
      { path: "/product/update/:id", element: <UpdateProduct /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
