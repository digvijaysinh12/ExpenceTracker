import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // Make sure the path is correct

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

    await axios.post(`${API_URL}/api/auth/login`, form, {
      withCredentials: true, 
    });

    toast.success('Login successful!');
    setForm({ email: '', password: '' });

    setTimeout(() => {
      navigate('/'); 
    }, 500);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
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
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                  disabled={loading}
                >
                  {loading ? <Spinner size="spinner-border-sm" color="text-light" message="" /> : 'Login'}
                </button>
              </form>

              <div className="text-center mt-3">
                <a href="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </a>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <a href="/signup" className="text-decoration-none">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
