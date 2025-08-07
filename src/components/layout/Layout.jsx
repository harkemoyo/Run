import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiMap, FiAlertTriangle, FiNavigation } from 'react-icons/fi';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container">
          <h1 className="app-logo">
            <Link to="/">Nairobi Runner Safety</Link>
          </h1>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/" className={isActive('/')}>
                  <FiHome className="nav-icon" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/live-run" className={isActive('/live-run')}>
                  <FiMap className="nav-icon" />
                  <span>Live Run</span>
                </Link>
              </li>
              <li>
                <Link to="/report-danger" className={isActive('/report-danger')}>
                  <FiAlertTriangle className="nav-icon" />
                  <span>Report</span>
                </Link>
              </li>
              <li>
                <Link to="/route-planner" className={isActive('/route-planner')}>
                  <FiNavigation className="nav-icon" />
                  <span>Plan Route</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Nairobi Runner Safety</p>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
