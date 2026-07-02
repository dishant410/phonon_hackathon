import React from 'react';
import { Bell, Sun, Moon, Menu, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/dashboard':   { label: 'Dashboard',       emoji: '📊' },
  '/risks':        { label: 'Risk Register',   emoji: '⚠️' },
  '/controls':     { label: 'Controls',        emoji: '🛡️' },
  '/audit':        { label: 'Audit Evidence',  emoji: '📁' },
  '/privacy':      { label: 'Privacy (DPDP)', emoji: '🔐' },
  '/policies':     { label: 'Policies',        emoji: '📋' },
  '/admin/users':  { label: 'User Management', emoji: '👥' },
};

const roleColors = {
  admin:            { bg: '#fee2e2', color: '#dc2626', label: 'Admin' },
  security_manager: { bg: '#eef2ff', color: '#4f46e5', label: 'GRC Manager' },
  auditor:          { bg: '#dbeafe', color: '#2563eb', label: 'Auditor' },
  employee:         { bg: '#f1f5f9', color: '#475569', label: 'Employee' },
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

  const page = breadcrumbMap[location.pathname] || { label: 'Dashboard', emoji: '📊' };
  const avatar = user?.name?.charAt(0).toUpperCase() || 'U';
  const rc = roleColors[user?.role] || roleColors.employee;

  return (
    <>
      <header className="nb-root glass">
        {/* Mobile hamburger */}
        <button className="nb-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="nb-breadcrumb">
          <span className="nb-breadcrumb__emoji">{page.emoji}</span>
          <h1 className="nb-breadcrumb__title">{page.label}</h1>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div className="nb-actions">
          {/* Notification */}
          <button className="nb-icon-btn" title="Notifications" style={{ position: 'relative' }}>
            <Bell size={17} />
            <span className="nb-notif-dot dot-pulse" />
          </button>

          {/* Divider */}
          <div className="nb-divider" />

          {/* Profile dropdown */}
          <div style={{ position: 'relative' }}>
            <button className="nb-profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="nb-avatar">{avatar}</div>
              <div className="nb-profile-info">
                <span className="nb-profile-name">{user?.name}</span>
                <span className="nb-profile-role" style={{ background: rc.bg, color: rc.color }}>
                  {rc.label}
                </span>
              </div>
              <ChevronDown
                size={13}
                style={{
                  color: '#94a3b8',
                  transition: 'transform 0.2s',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {profileOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setProfileOpen(false)} />
                <div className="nb-dropdown fade-up">
                  {/* Header */}
                  <div className="nb-dropdown__header">
                    <div className="nb-avatar nb-avatar--lg">{avatar}</div>
                    <div>
                      <p className="nb-dropdown__name">{user?.name}</p>
                      <p className="nb-dropdown__email">{user?.email}</p>
                      <span className="nb-dropdown__badge" style={{ background: rc.bg, color: rc.color }}>
                        {rc.label}
                      </span>
                    </div>
                  </div>
                  <div className="nb-dropdown__divider" />
                  <button onClick={handleLogout} className="nb-dropdown__item nb-dropdown__item--danger">
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <style>{`
        .nb-root {
          position: sticky; top: 0; z-index: 20;
          height: 58px;
          display: flex; align-items: center;
          gap: 12px; padding: 0 20px;
          background: rgba(255,255,255,0.95);
          border-bottom: 1px solid #e8edf5;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .nb-hamburger {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px;
          border-radius: 8px; border: none;
          background: transparent; color: #64748b;
          cursor: pointer; transition: all 0.15s;
          flex-shrink: 0;
        }
        .nb-hamburger:hover { background: #f1f5f9; color: #1e293b; }
        @media (min-width: 1024px) { .nb-hamburger { display: none; } }

        .nb-breadcrumb {
          display: flex; align-items: center; gap: 8px;
        }
        .nb-breadcrumb__emoji { font-size: 17px; }
        .nb-breadcrumb__title {
          font-size: 15px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.01em;
        }

        .nb-actions {
          display: flex; align-items: center; gap: 6px;
          flex-shrink: 0;
        }

        .nb-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px;
          border-radius: 8px; border: none;
          background: transparent; color: #64748b;
          cursor: pointer; transition: all 0.15s; position: relative;
        }
        .nb-icon-btn:hover { background: #f1f5f9; color: #4f46e5; }

        .nb-notif-dot {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px;
          background: #ef4444; border-radius: 50%;
          border: 1.5px solid #fff;
        }

        .nb-divider {
          width: 1px; height: 22px;
          background: #e2e8f0; margin: 0 4px;
        }

        .nb-profile-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 10px 5px 5px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nb-profile-btn:hover {
          border-color: #c7d2fe;
          background: #fafbff;
          box-shadow: 0 2px 8px rgba(79,70,229,0.08);
        }

        .nb-avatar {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 700;
          flex-shrink: 0;
        }
        .nb-avatar--lg {
          width: 40px; height: 40px;
          border-radius: 11px; font-size: 15px;
        }

        .nb-profile-info {
          display: none; flex-direction: column; text-align: left;
        }
        @media (min-width: 640px) { .nb-profile-info { display: flex; } }

        .nb-profile-name {
          font-size: 12.5px; font-weight: 700;
          color: #0f172a; white-space: nowrap; line-height: 1.3;
        }
        .nb-profile-role {
          font-size: 10px; font-weight: 700;
          padding: 1px 6px; border-radius: 99px;
          letter-spacing: 0.02em; white-space: nowrap;
          margin-top: 2px; display: inline-block; width: fit-content;
        }

        /* Dropdown */
        .nb-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 248px;
          background: #fff;
          border: 1.5px solid #e8edf5;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06);
          z-index: 20; overflow: hidden;
        }
        .nb-dropdown__header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px;
        }
        .nb-dropdown__name {
          font-size: 13.5px; font-weight: 700; color: #0f172a;
          line-height: 1.3;
        }
        .nb-dropdown__email {
          font-size: 11.5px; color: #94a3b8; margin-top: 1px;
          word-break: break-all;
        }
        .nb-dropdown__badge {
          display: inline-block; margin-top: 5px;
          font-size: 10.5px; font-weight: 700;
          padding: 2px 8px; border-radius: 99px;
        }
        .nb-dropdown__divider { height: 1px; background: #f1f5f9; }
        .nb-dropdown__item {
          display: flex; align-items: center; gap: 9px;
          width: 100%; padding: 11px 16px;
          font-size: 13.5px; font-weight: 500;
          border: none; background: transparent;
          cursor: pointer; transition: background 0.12s;
          text-align: left; color: #475569;
          font-family: inherit; margin: 4px 0;
        }
        .nb-dropdown__item:hover { background: #f8fafc; }
        .nb-dropdown__item--danger { color: #ef4444; }
        .nb-dropdown__item--danger:hover { background: #fff5f5; }
      `}</style>
    </>
  );
};

export default Navbar;
