import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/product/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });
  }, [id]);

  if (!product) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  const onHandleEdit = () => {
    navigate(`/product/update/${id}`);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/product/${id}`);
      alert("Product deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const imageUrl = `data:${product.imageType};base64,${product.imageData}`;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10 items-start bg-white shadow-lg rounded-lg p-6">
        <div className="w-full md:w-1/2">
          <div className="border rounded-lg overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: product.name,
                  isFluidWidth: true,
                  src: imageUrl,
                },
                largeImage: {
                  src: imageUrl,
                  width: 1200,
                  height: 1800,
                },
              }}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl text-green-600 font-semibold">
            ₹ {product.price}
          </p>
          <p className="text-gray-700">{product.description}</p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onHandleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              onClick={deleteProduct}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
