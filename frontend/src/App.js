import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import "./App.css";

const App = () => {
  return (
    <div className="page-background">
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/step1" element={<SignUpStep1 />} />
        <Route path="/signup/step2" element={<SignUpStep2 />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
    </div>
  );
};
export default App;
