import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout"; // Assuming Layout is your layout component

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            if (!data.token) {
                throw new Error("Token not received");
            }

            // Save token to local storage
            localStorage.setItem("token", data.token);
            navigate("/dashboard"); // Redirect to dashboard after successful login
        } catch (err) {
            setError("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Layout>
            <div className="container mt-2 mb-4">
                <h2 className="mb-4 text-center">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="shadow p-4 rounded border">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
