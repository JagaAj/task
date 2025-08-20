import ProductList from "./ProductList";

function Product() {
  return (
    <section className="container">
      <div className="products-container">
        <h1 className="secondary-heading">Product you may like</h1>
        <ProductList />
      </div>
    </section>
  );
}

export default Product;
