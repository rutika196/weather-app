import React from "react";
import "./NavBar.css";
import logo from "../../assets/logo.png";

const NavBar = () => {
  return (
    <section className="nav-section">
      <nav>
        <img src={logo} alt="Weather App Logo" />
        <ul>
          <li className="active">
            <i className="ph ph-house-simple"></i>
            <span>Home</span>
          </li>
          <li>
            <i className="ph ph-newspaper"></i>
            <span>News</span>
          </li>
          <li>
            <i className="ph ph-map-pin"></i>
            <span>Map</span>
          </li>
          <li>
            <i className="ph ph-gear"></i>
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default NavBar;
