import React from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center">Forgot Password</h2>
        <p className="text-center">
          This feature is under development. Please check back later.
        </p>
        <button
          className="btn btn-primary w-100"
          onClick={navigateToLogin}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
