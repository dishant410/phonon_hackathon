import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Shield, AlertTriangle, FileSearch, Lock, ScrollText,
  Users, ShieldCheck, Menu, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', roles: ['admin', 'security_manager', 'auditor', 'employee'] },
  { label: 'Risk Register', icon: AlertTriangle, to: '/risks', roles: ['admin', 'security_manager', 'auditor', 'employee'] },
  { label: 'Controls', icon: Shield, to: '/controls', roles: ['admin', 'security_manager', 'auditor', 'employee'] },
  { label: 'Audit Evidence', icon: FileSearch, to: '/audit', roles: ['admin', 'security_manager', 'auditor'] },
  { label: 'Privacy', icon: Lock, to: '/privacy', roles: ['admin', 'security_manager', 'auditor'] },
  { label: 'Policies', icon: ScrollText, to: '/policies', roles: ['admin', 'security_manager', 'auditor'] },
  { label: 'User Management', icon: Users, to: '/admin/users', roles: ['admin'] },
];

const NavItem = ({ item, collapsed }) => {
  const { user } = useAuth();
  if (!item.roles.includes(user?.role)) return null;

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'nav-item--active' : ''} ${collapsed ? 'nav-item--collapsed' : ''}`
      }
    >
      <span className="nav-item__icon">
        <item.icon size={17} />
      </span>
      {!collapsed && (
        <>
          <span className="nav-item__label">{item.label}</span>
          <ChevronRight size={12} className="nav-item__arrow" />
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          width: collapsed ? '68px' : '240px',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
        className={!mobileOpen ? 'sidebar-mobile-hidden' : ''}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo__icon">
            <ShieldCheck size={16} color="#fff" />
          </div>
          {!collapsed && (
            <div className="sidebar-logo__text">
              <span className="sidebar-logo__name">SecureComply</span>
              <span className="sidebar-logo__sub">GRC Platform</span>
            </div>
          )}
        </div>

        {/* Navigation label */}
        {!collapsed && (
          <p className="sidebar-section-label">Navigation</p>
        )}

        {/* Nav items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="sidebar-footer">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-collapse-btn"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={15} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-mobile-hidden {
          transform: translateX(-100%);
        }
        @media (min-width: 1024px) {
          .sidebar-mobile-hidden {
            transform: translateX(0) !important;
          }
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 16px 16px;
          border-bottom: 1px solid var(--sidebar-border);
          flex-shrink: 0;
        }

        .sidebar-logo__icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }

        .sidebar-logo__text {
          overflow: hidden;
          white-space: nowrap;
        }

        .sidebar-logo__name {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .sidebar-logo__sub {
          display: block;
          font-size: 10px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 1px;
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 16px 18px 6px;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 4px 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.15s ease;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-decoration: none;
        }

        .nav-item:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .nav-item--active {
          background: var(--nav-active-bg);
          color: var(--nav-active-text);
          font-weight: 600;
        }

        .nav-item--active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          border-radius: 0 3px 3px 0;
          background: var(--accent);
        }

        .nav-item__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .nav-item__label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-item__arrow {
          opacity: 0;
          color: var(--text-muted);
          transition: opacity 0.15s, transform 0.15s;
        }

        .nav-item:hover .nav-item__arrow,
        .nav-item--active .nav-item__arrow {
          opacity: 1;
          transform: translateX(1px);
        }

        .nav-item--collapsed {
          justify-content: center;
          padding: 10px;
        }

        .sidebar-footer {
          flex-shrink: 0;
          border-top: 1px solid var(--sidebar-border);
          padding: 10px;
        }

        .sidebar-collapse-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sidebar-collapse-btn:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
