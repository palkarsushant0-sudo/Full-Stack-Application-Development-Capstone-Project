import React from "react";
import "./Header.css";

const Header = () => {
  const username = sessionStorage.getItem("username");

  const logout = async () => {
    await fetch(window.location.origin + "/djangoapp/logout", { method: "GET" });
    sessionStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <a className="brand" href="/">Cars Dealership</a>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/contact/">Contact Us</a></li>
        {username ? (
          <>
            <li className="username">Welcome, {username}</li>
            <li><button className="link-btn" onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
