import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🚗</div>
          Auto<span>Dealr</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/listings" className={isActive('/listings')}>Browse</Link>
          {user && (
            <>
              <Link to="/create-listing" className={isActive('/create-listing')}>Sell Vehicle</Link>
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="navbar-user">
                <div className="navbar-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span style={{ display: 'none' }}>{user.name}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
