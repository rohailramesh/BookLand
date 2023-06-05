import React from "react";
import { Link } from "react-router-dom";
import { ReadOutlined, HomeOutlined } from "@ant-design/icons";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        color: "black",
        fontSize: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", marginRight: "0.5rem" }}>
          <HomeOutlined style={{ color: "black" }} />
        </Link>
        &nbsp;
        <h1 style={{ marginRight: "1rem", textAlign: "center" }}>BOOKLAND</h1>
        <Link
          to="/mybooks"
          style={{ textDecoration: "none", marginRight: "0.5rem" }}
        >
          <ReadOutlined style={{ color: "black" }} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
