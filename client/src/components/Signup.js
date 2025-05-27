import React, { useEffect, useState } from "react";
import './form.css'; // Optional CSS for spacing
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Spinner from "../pages/Spinner"; // Assuming the Spinner component is in the correct path

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Keep track of loading state for UX

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    setLoading(true); // Show the spinner when sending OTP
    try {
      console.log("Sending OTP to:", form.email); // Check payload
      console.log("URL:", '/api/v1/otp/send-otp'); // Check URL

      const res = await axios.post('http://localhost:5000/api/otp/send-otp', form);
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (err) {
      console.error("Error details:", err); // Logs full error
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false); // Hide spinner once the request is done
    }
  };

  const handleSignup = async () => {
    setLoading(true); // Show the spinner when completing signup
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { ...form, otp });
      toast.success(res.data.message);
      setLoading(false);

      setTimeout(() => {
        navigate('/login'); // Navigate to login page after successful signup
      }, 2000);

    } catch (err) {
      setLoading(false); // Hide spinner if the signup request fails
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/'); // Redirect if user is already logged in
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <ToastContainer position='top-center' />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Signup</h3>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Create a password"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Display the "Already have an account?" button here, before sending OTP */}
              <button
                className="btn btn-secondary w-100 mt-3"
                onClick={handleLoginRedirect}
              >
                Already have an account? Login
              </button>

              {!otpSent ? (
                <div className="position-relative">
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={sendOtp}
                    disabled={loading} // Disable the button while loading
                  >
                    {loading && (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <Spinner />
                      </div>
                    )}
                    Send OTP
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Enter OTP</label>
                    <input
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                    />
                  </div>
                  <div className="position-relative">
                    <button
                      className="btn btn-success w-100"
                      onClick={handleSignup}
                      disabled={loading} // Disable the button while loading
                    >
                      {loading && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <Spinner />
                        </div>
                      )}
                      Complete Signup
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
