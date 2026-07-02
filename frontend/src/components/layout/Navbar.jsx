import React from 'react';
import { Bell, Sun, Moon, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/dashboard': 'Dashboard',
  '/risks': 'Risk Register',
  '/controls': 'Controls Library',
  '/audit': 'Audit Evidence',
  '/privacy': 'Privacy (DPDP)',
  '/policies': 'Policies',
  '/admin/users': 'User Management',
};

const roleLabels = {
  admin: 'Administrator',
  security_manager: 'Security Manager',
  auditor: 'Auditor',
  employee: 'Employee',
};

const roleColors = {
  admin: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  security_manager: { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' },
  auditor: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  employee: { bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
};

const Navbar = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const pageTitle = breadcrumbMap[location.pathname] || 'Dashboard';
  const avatar = user?.name?.charAt(0).toUpperCase() || 'U';
  const rc = roleColors[user?.role] || roleColors.employee;

  return (
    <header className="sc-navbar glass">
      {/* Mobile hamburger */}
      <button
        className="sc-navbar__hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="sc-navbar__title">
        <h1>{pageTitle}</h1>
      </div>

      {/* Right actions */}
      <div className="sc-navbar__actions">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="sc-icon-btn"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="sc-icon-btn sc-notif-btn" title="Notifications">
          <Bell size={16} />
          <span className="sc-notif-badge" />
        </button>

        {/* Divider */}
        <div className="sc-navbar__divider" />

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="sc-profile-btn"
            aria-label="Profile menu"
          >
            <div className="sc-avatar">{avatar}</div>
            <div className="sc-profile-info">
              <span className="sc-profile-name">{user?.name}</span>
              <span className="sc-profile-role">{roleLabels[user?.role] || user?.role}</span>
            </div>
            <ChevronDown size={13} className={`sc-profile-chevron ${profileOpen ? 'sc-profile-chevron--open' : ''}`} />
          </button>

          {profileOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                onClick={() => setProfileOpen(false)}
              />
              <div className="sc-dropdown fade-up">
                <div className="sc-dropdown__header">
                  <div className="sc-avatar sc-avatar--lg">{avatar}</div>
                  <div>
                    <p className="sc-dropdown__name">{user?.name}</p>
                    <p className="sc-dropdown__email">{user?.email}</p>
                    <span
                      className="sc-role-badge"
                      style={{ background: rc.bg, color: rc.color }}
                    >
                      {roleLabels[user?.role] || user?.role}
                    </span>
                  </div>
                </div>
                <div className="sc-dropdown__divider" />
                <button onClick={handleLogout} className="sc-dropdown__item sc-dropdown__item--danger">
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .sc-navbar {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 58px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          background: var(--navbar-bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .sc-navbar__hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .sc-navbar__hamburger:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }
        @media (min-width: 1024px) {
          .sc-navbar__hamburger { display: none; }
        }

        .sc-navbar__title {
          flex: 1;
        }
        .sc-navbar__title h1 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .sc-navbar__actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .sc-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }
        .sc-icon-btn:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .sc-notif-btn { position: relative; }
        .sc-notif-badge {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          background: var(--color-danger);
          border-radius: 50%;
          border: 1.5px solid var(--navbar-bg);
        }

        .sc-navbar__divider {
          width: 1px;
          height: 22px;
          background: var(--border-strong);
          margin: 0 4px;
        }

        .sc-profile-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 10px 5px 5px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .sc-profile-btn:hover {
          background: var(--nav-hover-bg);
          border-color: var(--border-strong);
        }

        .sc-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          letter-spacing: 0;
        }
        .sc-avatar--lg {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          font-size: 15px;
        }

        .sc-profile-info {
          display: none;
          flex-direction: column;
          text-align: left;
        }
        @media (min-width: 640px) {
          .sc-profile-info { display: flex; }
        }

        .sc-profile-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          line-height: 1.3;
        }
        .sc-profile-role {
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .sc-profile-chevron {
          color: var(--text-muted);
          transition: transform 0.2s ease;
          display: none;
        }
        @media (min-width: 640px) {
          .sc-profile-chevron { display: block; }
        }
        .sc-profile-chevron--open {
          transform: rotate(180deg);
        }

        /* Dropdown */
        .sc-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 240px;
          background: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 20;
          overflow: hidden;
        }

        .sc-dropdown__header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }

        .sc-dropdown__name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .sc-dropdown__email {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 1px;
          word-break: break-all;
        }

        .sc-role-badge {
          display: inline-block;
          margin-top: 6px;
          font-size: 10.5px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 99px;
          letter-spacing: 0.02em;
        }

        .sc-dropdown__divider {
          height: 1px;
          background: var(--border);
          margin: 0 16px;
        }

        .sc-dropdown__item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 11px 16px;
          font-size: 13.5px;
          font-weight: 500;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
          color: var(--text-secondary);
          margin: 4px 0;
        }
        .sc-dropdown__item:hover {
          background: var(--nav-hover-bg);
        }
        .sc-dropdown__item--danger {
          color: var(--color-danger);
        }
        .sc-dropdown__item--danger:hover {
          background: rgba(239,68,68,0.08);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
