import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css'

function Layout({children}){
    const [darkMode,setDarkMode] = useState(() =>
        localStorage.getItem('theme') ==='dark'
    );

    useEffect(() => {
        document. body.className= darkMode?'bg-dark text-light' : 'bg-light text-dark';
        localStorage.setItem('theme',darkMode?'dark':'light');;
    },[darkMode]);
    return (
        <>
            <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <div className="container">
                    <Link className='navbar-brand' to="/">OTP Auth</Link>
                    <div className='d-flex'>
                        <Link className='btn btn-outline-primary me-2' to='/'>Signup</Link>
                        <Link className='btn btn-outline-success me-3' to='/login'>Login</Link>
                        <button
                            className={`btn btn-${darkMode ? 'light': 'dark'}`}
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
            </nav>
            <main className='container py-5'>{children}</main>
            <footer className={`text-center py-3 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div>&copy; {new Date().getFullYear()} OTP Auth App. All rights reserved.</div>
            </footer>
        </>
    );
}
export default Layout;
