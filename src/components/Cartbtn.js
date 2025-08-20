const Cartbtn = () => {
  return (
    <div className="btn-container">
      <ul className="btn-cart">
        <li>
          <button type="button" className="btn-addcart">
            Add to cart
          </button>
        </li>
        <li>
          <button type="button" className="btn-shortcart">
            shortlist
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Cartbtn;
