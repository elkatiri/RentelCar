import './navbar.css';
import { Search, Menu, X, LogOut, ChevronDown, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from './../../images/logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  // Hide navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
      </div>
      <div className='menu-icon' onClick={() => setOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </div>
      <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/">Cars</Link></li>
        {user && <li><Link to="/">My Bookings</Link></li>}
        {user && user.role === 'admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
        <div className="search-box">
          <input type="text" placeholder="Search..." />
          <Search className='search-icon' size={14} />
        </div>
        <li className='list-cars'>List cars</li>
        
        <div className="auth-section">
          {!token ? (
            <ul className="auth-links">
              <li><Link to="/login">Login</Link></li>
            </ul>
          ) : (
            <div className="user-dropdown" ref={dropdownRef}>
              <button 
                className="user-toggle" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <span className="user-name">{user?.name || 'User'}</span>
                <ChevronDown 
                  size={16} 
                  className={`chevron ${showDropdown ? 'rotate' : ''}`}
                />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <strong>{user?.name}</strong>
                      <span className="user-email">{user?.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </ul>
    </div>
  );
}