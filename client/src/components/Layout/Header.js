import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../pages/Spinner';
import { ThemeContext } from '../../context/ThemeContext';

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext); // ✅ Correct destructuring

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('user');
    setLoginUser(null);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 500);
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Expense Tracker App</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
            <li className="nav-item">
              <p className='nav-link'>{loginUser?.name}</p>
            </li>
            <li className='nav-item'>
              <button
                className='btn btn-sm btn-outline-secondary'
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </li>
            <li className="nav-item">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {loading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                  }}>
                    <Spinner small />
                  </div>
                )}
                <button
                  className='btn btn-primary'
                  onClick={handleLogout}
                  disabled={loading}
                  style={{ position: 'relative', zIndex: 0 }}
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
