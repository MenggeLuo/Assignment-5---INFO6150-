import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Search from "./components/search/search";
import MovieDetail from "./components/movie/MovieDetail";
import "./App.css";

const App = () => {
  return (
    <div className="page-background">

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup/step1" element={<SignUpStep1 />} />
          <Route path="/signup/step2" element={<SignUpStep2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>

    </div>
  );
};

export default App;