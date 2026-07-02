import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Shield, AlertTriangle, FileSearch,
  Lock, ScrollText, Users, ShieldCheck, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',       icon: LayoutDashboard, to: '/dashboard',    roles: ['admin','security_manager','auditor','employee'] },
  { label: 'Risk Register',   icon: AlertTriangle,   to: '/risks',         roles: ['admin','security_manager','auditor','employee'] },
  { label: 'Controls',        icon: Shield,          to: '/controls',      roles: ['admin','security_manager','auditor','employee'] },
  { label: 'Audit Evidence',  icon: FileSearch,      to: '/audit',         roles: ['admin','security_manager','auditor'] },
  { label: 'Privacy (DPDP)', icon: Lock,            to: '/privacy',       roles: ['admin','security_manager','auditor'] },
  { label: 'Policies',        icon: ScrollText,      to: '/policies',      roles: ['admin','security_manager','auditor'] },
  { label: 'User Management', icon: Users,           to: '/admin/users',   roles: ['admin'] },
];

const NavItem = ({ item, collapsed }) => {
  const { user } = useAuth();
  if (!item.roles.includes(user?.role)) return null;

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `sb-nav-item ${isActive ? 'sb-nav-item--active' : ''} ${collapsed ? 'sb-nav-item--collapsed' : ''}`}
    >
      <span className="sb-nav-item__icon">
        <item.icon size={17} />
      </span>
      {!collapsed && <span className="sb-nav-item__label">{item.label}</span>}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 30,
            background: 'rgba(15,23,42,0.35)',
            backdropFilter: 'blur(4px)',
          }}
          className="lg:hidden"
        />
      )}

      <aside className={`sb-root ${mobileOpen ? 'sb-root--open' : 'sb-root--closed'} ${collapsed ? 'sb-root--collapsed' : ''}`}>
        {/* Logo / Brand */}
        <div className="sb-brand">
          <div className="sb-brand__icon">
            <ShieldCheck size={17} color="#4f46e5" />
          </div>
          {!collapsed && (
            <div className="sb-brand__text">
              <span className="sb-brand__name">SecureComply</span>
              <span className="sb-brand__sub">GRC Platform</span>
            </div>
          )}
        </div>

        {/* Nav section label */}
        {!collapsed && <p className="sb-section-label">Menu</p>}

        {/* Navigation */}
        <nav className="sb-nav">
          {navItems.map((item, i) => (
            <div
              key={item.to}
              className="slide-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <NavItem item={item} collapsed={collapsed} />
            </div>
          ))}
        </nav>

        {/* Footer: collapse toggle */}
        <div className="sb-footer">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sb-collapse-btn"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <PanelLeftOpen size={16} />
              : <><PanelLeftClose size={16} /><span>Collapse</span></>
            }
          </button>
        </div>
      </aside>

      <style>{`
        .sb-root {
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          z-index: 40;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-right: 1px solid #e8edf5;
          box-shadow: 4px 0 24px rgba(15,23,42,0.05);
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1),
                      transform 0.28s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        .sb-root--closed { transform: translateX(-100%); }
        .sb-root--open   { transform: translateX(0); }
        .sb-root--collapsed { width: 68px; }
        :not(.sb-root--collapsed).sb-root { width: 240px; }
        @media (min-width: 1024px) {
          .sb-root--closed  { transform: translateX(0); }
        }

        /* Brand */
        .sb-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 18px 16px 16px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .sb-brand__icon {
          width: 36px; height: 36px;
          background: #eef2ff;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 1.5px solid #e0e7ff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .sb-brand__icon:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(79,70,229,0.20);
        }
        .sb-brand__name {
          display: block;
          font-size: 14px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .sb-brand__sub {
          display: block;
          font-size: 10px; font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-top: 1px;
        }

        /* Section label */
        .sb-section-label {
          font-size: 10px; font-weight: 700;
          color: #cbd5e1;
          text-transform: uppercase; letter-spacing: 0.10em;
          padding: 16px 18px 6px;
          flex-shrink: 0;
        }

        /* Nav */
        .sb-nav {
          flex: 1;
          overflow-y: auto;
          padding: 4px 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* Nav item */
        .sb-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        .sb-nav-item::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px; height: 65%;
          background: #4f46e5;
          border-radius: 0 3px 3px 0;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sb-nav-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }
        .sb-nav-item--active {
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 600;
        }
        .sb-nav-item--active::before {
          transform: translateY(-50%) scaleY(1);
        }
        .sb-nav-item__icon {
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; flex-shrink: 0;
        }
        .sb-nav-item__label {
          flex: 1;
          overflow: hidden; text-overflow: ellipsis;
        }
        .sb-nav-item--collapsed {
          justify-content: center;
          padding: 10px;
        }

        /* Footer */
        .sb-footer {
          border-top: 1px solid #f1f5f9;
          padding: 10px;
          flex-shrink: 0;
        }
        .sb-collapse-btn {
          display: flex; align-items: center; gap: 8px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .sb-collapse-btn:hover {
          background: #f8fafc;
          color: #4f46e5;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
