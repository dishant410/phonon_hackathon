import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Shield, AlertTriangle, FileSearch, Lock, ScrollText,
  Users, ChevronRight, ShieldCheck, X, Menu,
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
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 group
        ${isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-100'
        }
      `}
      title={collapsed ? item.label : undefined}
    >
      <item.icon size={18} className="flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-700/50
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">SecureComply</p>
              <p className="text-xs text-slate-400">Enterprise GRC Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Collapse Toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-end px-3 py-3 border-t border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
