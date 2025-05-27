import React,{useState} from "react";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async() => {
        try{
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password',{email});
            toast.success(res.data.message || 'Reset link sent to your email!');
        }catch(err){
            toast.error(err.response?.data?.message||'Failed to send reset link');
        }
    }
    return(
    <div className="container mt-5 ">
        <ToastContainer position="top-center"/>
            <div className="row justify-content-center ">
                <div className="col-md-6 col-lg-5 ">
                    <div className="card-body text-center">
                    <h3 className="card-title text-center mb-4">Forgot Password</h3>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-cotrol" placeholder="Enter your email" />
                    </div>
                    <button className="btn btn-primary w-100" onClick={handleSubmit}>Send Reset Link</button>
                    </div>
                </div>     
            </div> 
    </div>
    )
}

export default ForgotPassword;