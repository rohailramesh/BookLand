import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Search</Link>
        </li>
        <li>
          <Link to="/mybooks">My Books</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
