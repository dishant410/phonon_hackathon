import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import RiskRegister from '../pages/risks/RiskRegister';
import ControlLibrary from '../pages/controls/ControlLibrary';
import AuditEvidence from '../pages/audit/AuditEvidence';
import PrivacyObligations from '../pages/privacy/PrivacyObligations';
import PolicyManagement from '../pages/policies/PolicyManagement';
import UserManagement from '../pages/admin/UserManagement';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* Protected */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout><Dashboard /></DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/risks"
      element={
        <ProtectedRoute>
          <DashboardLayout><RiskRegister /></DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/controls"
      element={
        <ProtectedRoute>
          <DashboardLayout><ControlLibrary /></DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/audit"
      element={
        <ProtectedRoute roles={['admin', 'security_manager', 'auditor']}>
          <DashboardLayout><AuditEvidence /></DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/privacy"
      element={
        <ProtectedRoute roles={['admin', 'security_manager', 'auditor']}>
          <DashboardLayout><PrivacyObligations /></DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/policies"
      element={
        <ProtectedRoute roles={['admin', 'security_manager', 'auditor']}>
          <DashboardLayout><PolicyManagement /></DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><UserManagement /></DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
