import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      return toast.warning("Please enter your email");
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      toast.success(res.data.message || "Reset link sent to your email!");
      setEmail(""); // clear input after success
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "30px", backgroundColor: "#fff" }}
    >
      <ToastContainer position="top-center" />
      <h3 className="text-center mb-4" style={{ fontWeight: "600", color: "#333" }}>
        Forgot Password
      </h3>

      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label fw-semibold">
          Email address
        </label>
        <input
          id="emailInput"
          type="email"
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ fontSize: "1rem" }}
        />
      </div>

      <button className="btn btn-primary w-100 py-2" onClick={handleSubmit} style={{ fontWeight: "600" }}>
        Send Reset Link
      </button>

      <p className="mt-4 text-center" style={{ fontSize: "0.9rem", color: "#555" }}>
        Remembered your password?{" "}
        <a href="/login" style={{ color: "#0d6efd", fontWeight: "600", textDecoration: "none" }}>
          Login
        </a>
      </p>
    </div>
  );
};

export default ForgotPassword;
