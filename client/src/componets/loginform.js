import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './loginform.css';

export const LoginForm = () => {
  const [popupStyle, setPopupStyle] = useState("hide");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Verify if the user exists
      const response = await axios.post("http://localhost:3000/users/verify", {
        username,
        password,
        
      });
      if (response.status === 200) {
        // User exists, perform login
        // Use the login response data as needed
        console.log(response.data);
        // Handle successful login response
        // Redirect or update the UI accordingly
      } else {
        // User does not exist, display error message
        setPopupStyle("login-popup");
        setTimeout(() => setPopupStyle("hide"), 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // User does not exist, display error message
        setPopupStyle("login-popup");
        setTimeout(() => setPopupStyle("hide"), 3000);
      } else {
        // Handle other login errors
        console.error("Login error:", error);
        // Display generic error message or take appropriate action
      }
    }
  };

  return (
    <div className="page">
      <div className="cover">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-btn" onClick={handleLogin}>
          Login
        </div>

        <Link to="/signup">
          <p className="text">Or Sign Up</p>
        </Link>

        <div className={popupStyle}>
          <h3>Login Failed</h3>
          <p>Username or Password Incorrect</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;