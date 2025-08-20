import { NavLink } from "react-router-dom";

function Nav({ navName, to, close }) {
  return (
    <nav className="main-nav">
      <ul className="nav-list">
        <li>
          <NavLink onClick={close} className="nav-link" to={to}>
            {navName}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default Nav;
