import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Recycle, 
  MessageSquarePlus, 
  ClipboardList, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

const cls = ({ isActive }) => `nav-link ${isActive ? 'on' : ''}`;

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <div className="brand-icon-wrapper">
            <Recycle size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-title">
              EcoTrack
              <span className="live-pill" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', marginLeft: '0.3rem' }}>
                <span className="live-dot" style={{ width: '5px', height: '5px' }}></span> AI LIVE
              </span>
            </span>
            <span className="brand-subtitle">Smart Waste Management</span>
          </div>
        </Link>

        {/* Mobile toggle button */}
        <button 
          className="mobile-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink className={cls} to="/" onClick={closeMenu} end>
            Home
          </NavLink>
          
          {user ? (
            <>
              <NavLink className={cls} to="/assistant" onClick={closeMenu}>
                <MessageSquarePlus size={16} />
                <span>Report Issue</span>
              </NavLink>
              <NavLink className={cls} to="/complaints" onClick={closeMenu}>
                <ClipboardList size={16} />
                <span>My Complaints</span>
              </NavLink>
              {user.role === 'admin' && (
                <NavLink className={cls} to="/admin" onClick={closeMenu}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>
              )}

              <div className="nav-user-section">
                <div className="user-badge" title={user.email}>
                  <UserIcon size={14} />
                  <span>{user.name || user.email?.split('@')[0]}</span>
                  <span className={`user-role-tag ${user.role === 'admin' ? 'admin' : ''}`}>
                    {user.role === 'admin' ? 'Admin' : 'Citizen'}
                  </span>
                </div>
                <button 
                  className="btn-logout" 
                  onClick={() => { closeMenu(); signOut(); }}
                  title="Sign out of your account"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="nav-user-section">
              <NavLink className={cls} to="/login" onClick={closeMenu}>
                <LogIn size={16} />
                <span>Log in</span>
              </NavLink>
              <NavLink className="btn btn-primary" to="/register" onClick={closeMenu} style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}>
                <UserPlus size={15} />
                <span>Get Started</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
