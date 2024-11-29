import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "./Captcha";
import emailjs from "@emailjs/browser";
import "bootstrap/dist/css/bootstrap.min.css";
import { checkEmailExists,saveEmail, verifyCode } from "../api";

const SignUpStep1 = () => {
  const [email, setEmail] = useState("");
  const [emailVerificationInput, setEmailVerificationInput] = useState("");
  const [generatedEmailCode, setGeneratedEmailCode] = useState("");
  const [verificationInput, setVerificationInput] = useState(""); // Graphic verification code entered by the user
  const [captchaCode, setCaptchaCode] = useState(""); // Currently generated graphic verification code
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false); // send state
  const [countdown, setCountdown] = useState(0); // count down
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const regex = /([\w\.+]+)@northeastern.edu/;
    return regex.test(email);
  };

  // Generate a random 6-digit email verification code
  const generateEmailCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Start countdown timer
  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const navigateToLogin = () => {
    if (window.confirm("Are you sure you want to go back? Your data will be cleared.")) {
      clearForm();
      navigate("/login");
    }
  };

  const clearForm = () => {
    setEmail("");
    setVerificationInput("");
    setCaptchaCode("");
    setEmailSent(false);
    setError({});
  };

  // Handle Send Email Verification
  const sendEmailVerification = async () => {
    const validationErrors = {};
    if (!validateEmail(email)) {
        validationErrors.email = "Email must be a valid Northeastern email address.";
    }
    if (!verificationInput.trim()) {
        validationErrors.captcha = "Captcha is required.";
    } else if (verificationInput.trim().toLowerCase() !== captchaCode.trim().toLowerCase()) {
        validationErrors.captcha = "Captcha is incorrect. Please try again.";
    }
    if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
    }

    try {
        await saveEmail(email); // 调用后端保存邮箱并发送验证码
        setSending(false);
        setEmailSent(true);
        setError({});
        console.log("Email saved and verification code sent!");
        startCountdown(60);
    } catch (err) {
        setSending(false);
        if (err.response?.status === 409) {
            setError({ email: "This email is already registered." });
        } else {
            setError({ server: "Error sending email. Please try again later." });
        }
    }
};


  // Handle Next Step
  const handleNext = async () => {
    const validationErrors = {};

    // 验证邮件验证码是否为空
    if (!emailVerificationInput.trim()) {
        validationErrors.emailVerification = "Email verification code is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
    }

    try {
        const response = await verifyCode(email, emailVerificationInput); // 调用后端验证验证码
        const tempToken = response.data.tempToken; // 从后端获取临时Token
        localStorage.setItem("tempToken", tempToken); // 将临时Token保存到localStorage
        navigate("/signup/step2");
    } catch (err) {
        setError({ emailVerification: "Invalid or expired verification code. Please try again." });
    }
};

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center">Sign Up - Step 1</h2>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <div className="text-danger">{error.email}</div>}
        </div>

        {/* Captcha Component */}
        <Captcha
          onValidate={(value) => setVerificationInput(value)} // Set the verification code entered by the user
          setCaptchaCode={(code) => setCaptchaCode(code)} // Set the generated graphic verification code
        />
        {error.captcha && <div className="text-danger">{error.captcha}</div>}

        {/* Send Email Button */}
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-primary"
            onClick={sendEmailVerification}
            disabled={sending || countdown > 0} // Prevent duplicate sending
          >
            {sending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Verification Code"}
          </button>
          {emailSent && !sending && (
            <span className="text-success ms-3">Verification code sent! Please check your email.</span>
          )}
        </div>

        {/* Email Verification Code Field */}
        {emailSent && (
          <div className="mb-3 mt-3">
            <label htmlFor="emailVerificationCode" className="form-label">
              Enter Email Verification Code
            </label>
            <input
              type="text"
              className="form-control"
              id="emailVerificationCode"
              value={emailVerificationInput}
              onChange={(e) => setEmailVerificationInput(e.target.value)}
            />
            {error.emailVerification && (
              <div className="text-danger">{error.emailVerification}</div>
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          className={`btn w-100 mt-2 ${emailSent ? "btn-primary" : "btn-secondary disabled"}`}
          onClick={handleNext}
          disabled={!emailSent}
        >
          Next
        </button>

        {/* Back to Login */}
        <button className="btn btn-link mt-3" onClick={navigateToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUpStep1;
