import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserCheck, ShieldAlert, Key } from 'lucide-react';
import authService from '../../services/authService';
import Card from '../../components/ui/Card';
import Table, { Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { statusBadge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/FormComponents';

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: res } = await authService.getUsers({
        page,
        limit,
        search,
      });
      setData(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load user administration list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      toast.success('User authorization access role updated.');
      fetchUsers();
    } catch {
      toast.error('Could not apply new authorization role.');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const nextState = !user.isActive;
      await authService.updateUserStatus(user._id, nextState);
      toast.success(`User successfully ${nextState ? 'activated' : 'deactivated'}.`);
      fetchUsers();
    } catch {
      toast.error('Could not modify user status.');
    }
  };

  const columns = [
    { key: 'name', label: 'Identity / Email Address', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-205">{val}</p>
        <p className="text-xs text-slate-400">{row.email}</p>
      </div>
    )},
    { key: 'department', label: 'Department', render: (val) => val || 'General GRC' },
    { key: 'role', label: 'Access Class Privilege', render: (val, row) => (
      <Select
        value={val}
        onChange={(e) => handleRoleChange(row._id, e.target.value)}
        className="w-40 text-xs py-1 rounded bg-slate-900 border border-slate-700/50"
      >
        <option value="admin">Administrator</option>
        <option value="security_manager">Security Manager</option>
        <option value="auditor">Auditor</option>
        <option value="employee">Employee</option>
      </Select>
    )},
    {
      key: 'isActive',
      label: 'Privilege Status',
      render: (val, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
          {val ? 'ACTIVE' : 'SUSPENDED'}
        </span>
      ),
    },
    {
      key: '_id',
      label: 'Role Audit Actions',
      render: (val, row) => (
        <Button
          size="xs"
          variant={row.isActive ? 'danger' : 'success'}
          onClick={() => handleToggleStatus(row)}
        >
          {row.isActive ? 'Suspend access' : 'Reinstate access'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Identity & Role Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Perform access audits, adjust security clearances, and restrict/reinstate GRC portal users.</p>
      </div>

      <Card padding={false} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee identities or emails..."
          />
        </div>
      </Card>

      <Card padding={false} className="p-1">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage="No active organization profiles logged."
        />
        <Pagination
          page={page}
          pages={Math.ceil(total / limit)}
          total={total}
          limit={limit}
          onPageChange={(p) => setPage(p)}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
