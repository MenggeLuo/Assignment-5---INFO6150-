import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "./Captcha";
import { loginUser } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    const validationErrors = {};

    // Validate Captcha
    if (captchaInput.trim().toLowerCase() !== captchaCode.trim().toLowerCase()) {
      validationErrors.captcha = "Captcha is incorrect. Please try again.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const response = await loginUser(email, password);
      console.log("Login successful", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      setError({ login: err.response?.data?.error || "Login failed" });
    }
  };

  const navigateToSignup = () => {
    navigate("/signup/step1");
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center">Login</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Captcha
          onValidate={(value) => setCaptchaInput(value)}
          setCaptchaCode={(code) => setCaptchaCode(code)}
        />
        {error.captcha && <div className="text-danger">{error.captcha}</div>}
        {error.login && <div className="text-danger">{error.login}</div>}
        <button className="btn btn-primary w-100 mt-2" onClick={handleLogin}>
          Login
        </button>
        <div className="mt-3 text-center">
          Don't have an account?{" "}
          <button
            className="btn btn-link p-0"
            onClick={navigateToSignup}
          >
            Sign Up
          </button>
        </div>
        <div className="mt-3 text-center">
          Forgot Password?{" "}
          <button
            className="btn btn-link p-0"
            onClick={navigateToForgotPassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
