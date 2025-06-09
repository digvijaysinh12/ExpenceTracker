import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from './Spinner'; // Make sure Spinner component exists

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.warning('Please fill in all fields');
    }

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        form,
        { withCredentials: true }
      );

      console.log('Login response', data);

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Login successful!');
      setForm({ email: '', password: '' });

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      // Defensive error handling, fallback message
      const message =
        err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="spinner-border-sm" color="text-light" message="" />
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/signup" className="text-decoration-none">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
