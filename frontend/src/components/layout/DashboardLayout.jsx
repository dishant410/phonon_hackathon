import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        style={{
          paddingLeft: collapsed ? '68px' : '240px',
          transition: 'padding-left 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="dash-content"
      >
        <Navbar setMobileOpen={setMobileOpen} />
        <main
          className="page-enter"
          style={{ padding: '24px', minHeight: 'calc(100vh - 58px)' }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .dash-content { padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
