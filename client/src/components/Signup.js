import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "User" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    if (!form.email) {
      return toast.warning("Please enter your email before requesting OTP");
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/otp/send-otp", { ...form });
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !otp) {
      return toast.warning("Please fill in all fields and enter the OTP");
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", { ...form, otp });
      toast.success(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Layout>
      <ToastContainer position="top-center" />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Signup</h3>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label fw-semibold">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {!otpSent ? (
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={sendOtp}
                  disabled={loading}
                  type="button"
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm text-light me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Send OTP
                </button>
              ) : (
                <>
                  <div className="mb-3 mt-3">
                    <label htmlFor="otp" className="form-label fw-semibold">
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      maxLength={6}
                    />
                  </div>
                  <button
                    className="btn btn-success w-100"
                    onClick={handleSignup}
                    disabled={loading}
                    type="button"
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm text-light me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Complete Signup
                  </button>
                </>
              )}
            </div>
                          {/* Text link to login */}
              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-primary text-decoration-none">
                  Login
                </Link>
              </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Signup;
