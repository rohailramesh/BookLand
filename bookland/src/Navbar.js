import React from "react";
import { Link } from "react-router-dom";
import { ReadOutlined, SearchOutlined } from "@ant-design/icons";

const Navbar = () => {
  return (
    <nav style={{ justifyItems: "center", color: "black" }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <SearchOutlined style={{ color: "black" }} />
      </Link>
      &nbsp; &nbsp;
      <Link to="/mybooks" style={{ textDecoration: "none" }}>
        <ReadOutlined style={{ color: "black" }} />
      </Link>
    </nav>
  );
};

export default Navbar;
