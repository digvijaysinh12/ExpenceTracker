import React from 'react';
import Signup from './components/Signup';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ThemeProvider from './context/ThemeContext';


function App() {
  return (
    <ThemeProvider>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
    </ThemeProvider>

  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem('user')) {
    return props.children
  } else {
    return <Navigate to={"/login"} />;
  }
}
export default App;
