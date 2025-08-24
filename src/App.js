import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Kinicio from "./components/Kinicio";
import AuthForm from "./components/AuthForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./i18n";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kinicio" element={<Kinicio />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
    </Router>
  );
};

export default App;


