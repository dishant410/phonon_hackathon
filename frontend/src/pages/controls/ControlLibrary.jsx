import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, HelpCircle } from 'lucide-react';
import controlService from '../../services/controlService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table, { Pagination } from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/FormComponents';
import ControlForm from './ControlForm';

const ControlLibrary = () => {
  const { isManager } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filter params
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingControl, setEditingControl] = useState(null);

  // Quick review modal
  const [testingModalOpen, setTestingModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);

  const fetchControls = async () => {
    try {
      setLoading(true);
      const { data } = await controlService.getAll({
        page,
        limit,
        search,
        status,
        type,
      });
      setData(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load compliance control list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchControls();
  }, [page, status, type, search]);

  const handleCreateOrUpdate = async (formData) => {
    setFormLoading(true);
    try {
      if (editingControl) {
        await controlService.update(editingControl._id, formData);
        toast.success('Compliance control modified successfully.');
      } else {
        await controlService.create(formData);
        toast.success('Regulatory control created.');
      }
      setModalOpen(false);
      fetchControls();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while saving control parameter.');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'controlId', label: 'Control Ref', cellClassName: 'font-mono' },
    { key: 'title', label: 'Description', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">{val}</p>
        <p className="text-xs text-slate-400 capitalize">SOC2 Reference: {row.soc2Category || 'N/A'}</p>
      </div>
    )},
    { key: 'type', label: 'Mechanism Type', render: (val) => (
      <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/20 text-indigo-400">
        {val}
      </span>
    )},
    { key: 'status', label: 'Implementation Status', render: (val) => statusBadge(val) },
    { key: 'owner', label: 'Owner Assignment', render: (val) => val?.name || 'Unassigned' },
    {
      key: '_id',
      label: 'Actions',
      render: (val, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="xs" variant="secondary" onClick={() => { setSelectedControl(row); setTestingModalOpen(true); }}>
            Inspect
          </Button>
          {isManager() && (
            <Button size="xs" variant="ghost" onClick={() => { setEditingControl(row); setModalOpen(true); }}>
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Compliance Controls</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verify SOC 2 Type II trust categories and DPDP compliance obligations.</p>
        </div>
        {isManager() && (
          <Button onClick={() => { setEditingControl(null); setModalOpen(true); }}>
            <Plus size={16} /> New Control Parameter
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <Card padding={false} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search control ref or title..."
          />
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">All Verification Types</option>
            <option value="preventive">Preventive</option>
            <option value="detective">Detective</option>
            <option value="corrective">Corrective</option>
          </Select>

          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="partial">Partial</option>
            <option value="implemented">Implemented</option>
          </Select>
        </div>
      </Card>

      {/* Data Table */}
      <Card padding={false} className="p-1">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onRowClick={(row) => { setSelectedControl(row); setTestingModalOpen(true); }}
          emptyMessage="No matching controls logged."
        />
        <Pagination
          page={page}
          pages={Math.ceil(total / limit)}
          total={total}
          limit={limit}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingControl ? `Edit Control: ${editingControl.controlId}` : 'Register Compliance Control'}
      >
        <ControlForm
          control={editingControl}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Testing procedure & mapping inspect info details */}
      <Modal
        isOpen={testingModalOpen}
        onClose={() => setTestingModalOpen(false)}
        title={selectedControl ? `Compliance Procedure: ${selectedControl.controlId}` : ''}
      >
        {selectedControl && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Mitigated Core Risks</p>
              <h3 className="text-lg font-bold text-slate-200 mt-0.5">{selectedControl.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{selectedControl.description}</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-indigo-400 font-semibold block">Testing Action Instruction:</span>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                {selectedControl.testingProcedure || 'No audit verification script supplied.'}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="text-xs text-slate-400">SOC2 Category:</span>
              <span className="text-xs text-slate-205 font-bold">{selectedControl.soc2Category || '—'}</span>
            </div>

            <div className="flex justify-end pt-3">
              <Button onClick={() => setTestingModalOpen(false)}>Close Inspection</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ControlLibrary;
