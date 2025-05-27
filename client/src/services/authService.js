import axios from 'axios';

const API_URL = 'http://lacalhost:5000/api/auth/';

const register = async ( username, email, password) => {
    const response = await axios.post(API_URL + 'register',{
        username,
        email,
        password,
    });
    return response.data;
};

const verifyOtp = async(email, otp, password) => {
    const response = await axios.post(API_URL + 'verify-otp',{
        email,
        otp,
        password,

    });
    return response.data;
};

const login = async (email,password) => {
    const response= await axios.post(API_URL + 'login', {
        email,
        password,
    });
    localStorage.setItem('token',response.data.token); //token Store in local storage
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');   //Remove token from local storage
};

const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
};

export default {
    register,
    verifyOtp,
    login,
    logout,
    getCurrentUser,
};