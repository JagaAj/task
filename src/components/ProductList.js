import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cartbtn from "./Cartbtn";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <div className="productlist">
        <ul className="list">
          {products.length > 0 ? (
            products.map((product) => (
              <li className="product-items" key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <img
                    className="product-img"
                    src={
                      product.imageData
                        ? `data:${product.imageType};base64,${product.imageData}`
                        : "/images/placeholder-image.png"
                    }
                    alt={product.name ? product.name : "Product image"}
                  />
                </Link>
                <div className="product-name-price">
                  <Link to={`/product/${product.id}`}>
                    <h1 className="product-name">{product.name}</h1>
                  </Link>
                  <span className="product-price">&#8377; {product.price}</span>
                </div>
                <div>
                  <Cartbtn product={product} />
                </div>
              </li>
            ))
          ) : (
            <p>No products available</p>
          )}
        </ul>
      </div>
    </section>
  );
}

export default ProductList;
