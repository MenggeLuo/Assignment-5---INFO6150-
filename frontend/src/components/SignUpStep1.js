import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "./Captcha";
import emailjs from "@emailjs/browser";
import "bootstrap/dist/css/bootstrap.min.css";
import { checkEmailExists } from "../api";

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
        // 调用邮箱存在性检查 API
        const response = await checkEmailExists(email);
        console.log(response.data.message); // "Email is available."
    } catch (err) {
        if (err.response?.status === 409) {
            setError({ email: "This email is already registered." });
            return;
        }
        setError({ server: "Error checking email. Please try again later." });
        return;
    }

    // 如果邮箱不存在，发送验证码
    setSending(true);
    const code = generateEmailCode(); // 调用 generateEmailCode 生成验证码
    setGeneratedEmailCode(code); // 将生成的验证码存储到状态中
    emailjs
        .send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            {
                to_name: email,
                to_email: email,
                verification_code: code, // 发送的验证码
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            setSending(false);
            setEmailSent(true);
            setError({});
            console.log("Email sent successfully!");
            startCountdown(60);
        })
        .catch((error) => {
            setSending(false);
            console.error("Error sending email:", error);
            setError({ server: "Failed to send email. Please try again later." });
        });
};


  // Handle Next Step
  const handleNext = () => {
    const validationErrors = {};

    // Validate Email Verification Code
    console.log(emailVerificationInput)
    console.log(generatedEmailCode)
    if (emailVerificationInput !== generatedEmailCode) {
      validationErrors.emailVerification = "Email verification code is incorrect.";
    }

    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Save email to localStorage or context
      localStorage.setItem("email", email);
      navigate("/signup/step2");
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
