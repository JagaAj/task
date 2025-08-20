import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    productAvailable: false,
    attributesMap: {},
  });

  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (product.category) {
      axios
        .get(
          `http://localhost:8080/api/categories/${product.category}/attributes`
        )
        .then((res) => setAttributes(res.data))
        .catch((err) => console.error("Error fetching attributes:", err));
    } else {
      setAttributes([]);
    }
  }, [product.category]);

  const fetchProducts = () => {
    axios
      .get("http://localhost:8080/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (e, attr) => {
    let value = e.target.value;
    if (attr.dataType?.toLowerCase() === "number") value = Number(value);
    if (attr.dataType?.toLowerCase() === "boolean") value = e.target.checked;

    setProduct((prev) => ({
      ...prev,
      attributesMap: {
        ...prev.attributesMap,
        [attr.name]: value,
      },
    }));
  };

  const onSubmitHandle = (e) => {
    e.preventDefault();
    const productToSend = {
      ...product,
      attributes: Object.entries(product.attributesMap).map(
        ([name, value]) => ({ name, value })
      ),
    };

    const formData = new FormData();
    if (image) formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(productToSend)], { type: "application/json" })
    );

    axios
      .post("http://localhost:8080/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Product added successfully");
        setProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          stockQuantity: "",
          productAvailable: false,
          attributesMap: {},
        });
        setImage(null);
        fetchProducts();
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Error adding product");
      });
  };

  return (
    <>
      {/* product add */}
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Add New Product
        </h2>
        <form className="space-y-6" onSubmit={onSubmitHandle}>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInput}
              placeholder="Enter product name"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={product.description}
              onChange={handleInput}
              placeholder="Enter description"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInput}
              placeholder="Enter price"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Category
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleInput}
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* adding attribute here */}
          {attributes.map((attr) => {
            const value = product.attributesMap?.[attr.name] || "";
            const type = attr.dataType?.toLowerCase() || "string";
            return (
              <div key={attr.id} className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-lg">
                  {attr.name}
                </label>
                {(type === "text" || type === "string") && (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleAttributeChange(e, attr)}
                    className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
                  />
                )}
                {(type === "number" ||
                  type === "integer" ||
                  type === "bigint") && (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleAttributeChange(e, attr)}
                    className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
                  />
                )}
                {(type === "boolean" || type === "bool") && (
                  <input
                    type="checkbox"
                    checked={value === true}
                    onChange={(e) => handleAttributeChange(e, attr)}
                    className="w-6 h-6 text-blue-500"
                  />
                )}
              </div>
            );
          })}

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleInput}
              placeholder="Enter stock quantity"
              className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-3 text-base"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="productAvailable"
              checked={product.productAvailable}
              onChange={(e) =>
                setProduct({ ...product, productAvailable: e.target.checked })
              }
              className="w-6 h-6 text-blue-500"
            />
            <label className="text-gray-700 font-medium text-lg">
              Product Available
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md text-lg transition"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="mt-10 w-full mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          All Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full w-full bg-white border rounded-lg shadow text-lg">
            <thead className="bg-gray-100 text-gray-700 text-lg">
              <tr>
                <th className="py-3 px-6 border">Name</th>
                <th className="py-3 px-6 border">Description</th>
                <th className="py-3 px-6 border">Price</th>
                <th className="py-3 px-6 border">Category</th>
                <th className="py-3 px-6 border">Stock</th>
                <th className="py-3 px-6 border">Available</th>
                <th className="py-3 px-6 border">Attributes</th>
                <th className="py-3 px-6 border">Image</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {products.map((prod) => (
                <tr key={prod.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 border">{prod.name}</td>
                  <td className="py-3 px-6 border">{prod.description}</td>
                  <td className="py-3 px-6 border">{prod.price}</td>
                  <td className="py-3 px-6 border">
                    {categories.find((c) => c.id === prod.category)?.name || ""}
                  </td>
                  <td className="py-3 px-6 border">{prod.stockQuantity}</td>
                  <td className="py-3 px-6 border">
                    {prod.productAvailable ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-6 border">
                    {prod.attributes
                      ?.map((a) => `${a.name}: ${a.value}`)
                      .join(", ")}
                  </td>
                  <td className="py-3 px-6 border">
                    {prod.imageUrl && (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="h-20 w-20 object-cover mx-auto rounded"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
