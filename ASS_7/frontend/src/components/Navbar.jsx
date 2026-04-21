import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        📝 EduFeedback
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>My Feedback</Link>
            <Link to="/submit" className={`nav-link ${pathname === '/submit' ? 'active' : ''}`}>Submit</Link>
            {isAdmin && <Link to="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>Admin</Link>}
            <span className="nav-username">{user.name}</span>
            <span className={`nav-badge ${isAdmin ? 'admin' : 'student'}`}>{user.role}</span>
            <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${pathname === '/login' ? 'active' : ''}`}>Login</Link>
            <Link to="/register" className={`nav-link ${pathname === '/register' ? 'active' : ''}`}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
