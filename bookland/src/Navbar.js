import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Search</Link>
      &nbsp;
      <Link to="/mybooks">My Books</Link>
    </nav>
  );
};

export default Navbar;
