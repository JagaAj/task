import { useState } from "react";
import Nav from "./Nav.js";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar.js";

function MainNavigation() {
  const [openMenu, IsOpenMenu] = useState(false);
  function handleClick() {
    IsOpenMenu(!openMenu);
  }
  function closeMenu() {
    IsOpenMenu(false);
  }
  return (
    <header className="header">
      <div className="logo-div">
        <Link className="logo" to="/">
          Ecommerce
        </Link>
        <Searchbar />
        <div onClick={handleClick} className="menu-icon">
          {openMenu ? (
            <ion-icon class="icon-mobile-nav" name="close-outline"></ion-icon>
          ) : (
            <ion-icon class="icon-mobile-nav" name="menu-outline"></ion-icon>
          )}
        </div>
      </div>

      <div>
        <nav className={openMenu ? "navigation active" : "navigation"}>
          <Nav close={closeMenu} navName="Home" to="/" />
          <Nav close={closeMenu} navName="Categories" to="/categories" />
          <Nav close={closeMenu} navName="Add Product" to="/add_product" />
          {/* <NavLink to="/GetInTouch" className="btn">
            Cart
          </NavLink> */}
        </nav>
      </div>
    </header>
  );
}
export default MainNavigation;
