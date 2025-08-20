import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();

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

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/product/${id}`);
        const prodData = response.data;
        setProduct({
          ...prodData,
          attributesMap: Object.fromEntries(
            (prodData.attributes || []).map((attr) => [attr.name, attr.value])
          ),
        });

        // Fetch image as blob
        const responseImage = await axios.get(
          `http://localhost:8080/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = new File([responseImage.data], prodData.imageName, {
          type: responseImage.data.type,
        });
        setImage(imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch attributes for selected category
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
      attributesMap: { ...prev.attributesMap, [attr.name]: value },
    }));
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const onHandleUpdate = async (e) => {
    e.preventDefault();
    const productToSend = {
      ...product,
      attributes: Object.entries(product.attributesMap).map(
        ([name, value]) => ({
          name,
          value,
        })
      ),
    };

    const formData = new FormData();
    if (image) formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(productToSend)], { type: "application/json" })
    );

    try {
      const response = await axios.put(
        `http://localhost:8080/product/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Product updated successfully:", response.data);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Update Product
      </h2>

      <form className="space-y-5" onSubmit={onHandleUpdate}>
        {/* Basic Fields */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInput}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInput}
            placeholder="Enter description"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInput}
            placeholder="Enter price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleInput}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Attributes */}
        {attributes.map((attr) => {
          const value = product.attributesMap?.[attr.name] || "";
          const type = attr.dataType?.toLowerCase() || "string";

          return (
            <div key={attr.id} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                {attr.name}
              </label>
              {["text", "string"].includes(type) && (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleAttributeChange(e, attr)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
              {["number", "integer", "bigint"].includes(type) && (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleAttributeChange(e, attr)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
              {["boolean", "bool"].includes(type) && (
                <input
                  type="checkbox"
                  checked={value === true}
                  onChange={(e) => handleAttributeChange(e, attr)}
                  className="w-5 h-5 text-blue-500"
                />
              )}
            </div>
          );
        })}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleInput}
            placeholder="Enter stock quantity"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable}
            onChange={(e) =>
              setProduct({ ...product, productAvailable: e.target.checked })
            }
            className="w-5 h-5 text-blue-500"
          />
          <label className="text-gray-700 font-medium">Product Available</label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
