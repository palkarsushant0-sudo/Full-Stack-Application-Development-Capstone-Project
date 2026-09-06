import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const login_url = window.location.origin + "/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch(login_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });
    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      window.location.href = "/";
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {errorMessage && <div className="error-banner">{errorMessage}</div>}
      <form onSubmit={login} className="login-form">
        <label htmlFor="userName">Username</label>
        <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
