import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Calendar, Landmark } from 'lucide-react';
import api from '../../api/axios';
import privacyService from '../../services/privacyService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table, { Pagination } from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/FormComponents';
import PrivacyForm from './PrivacyForm';

const PrivacyObligations = () => {
  const { isManager } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [obligationType, setObligationType] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingObligation, setEditingObligation] = useState(null);

  // Inspector
  const [inspectOpen, setInspectOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState(null);

  const fetchObligations = async () => {
    try {
      setLoading(true);
      const { data: res } = await privacyService.getAll({
        page,
        limit,
        status,
        obligationType,
      });
      setData(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load DPDP Act compliance tracker database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObligations();
  }, [page, status, obligationType]);

  const handleCreateOrUpdate = async (formData) => {
    setFormLoading(true);
    try {
      if (editingObligation) {
        await privacyService.update(editingObligation._id, formData);
        toast.success('Privacy obligation successfully modified.');
      } else {
        await privacyService.create(formData);
        toast.success('DPDP obligation created.');
      }
      setModalOpen(false);
      fetchObligations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while saving obligation details.');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'dpdpSection', label: 'DPDP Reference', cellClassName: 'font-semibold' },
    { key: 'title', label: 'Item Identifier', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-205">{val}</p>
        <p className="text-xs text-slate-400 capitalize">Obligation Type: {row.obligationType}</p>
      </div>
    )},
    { key: 'status', label: 'Workflow', render: (val) => statusBadge(val) },
    { key: 'responsibleParty', label: 'Responsible Officer', render: (val) => val?.name || 'Unassigned' },
    { key: 'dueDate', label: 'Deadline', render: (val) => val ? new Date(val).toLocaleDateString() : 'No Limit' },
    {
      key: '_id',
      label: 'Actions',
      render: (val, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="xs" variant="secondary" onClick={() => { setSelectedObligation(row); setInspectOpen(true); }}>
            Inspect
          </Button>
          {isManager() && (
            <Button size="xs" variant="ghost" onClick={() => { setEditingObligation(row); setModalOpen(true); }}>
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">DPDP Act Compliance Readiness</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Log consent parameters, cross border transfers and DSAR timelines to align GRC audit workflows.</p>
        </div>
        {isManager() && (
          <Button onClick={() => { setEditingObligation(null); setModalOpen(true); }}>
            <Plus size={16} /> New Obligation
          </Button>
        )}
      </div>

      {/* Filter toolbar */}
      <Card padding={false} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search DPDP Section references..."
          />
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Select value={obligationType} onChange={(e) => { setObligationType(e.target.value); setPage(1); }}>
            <option value="">All Privacy Types</option>
            <option value="consent">Consent Management</option>
            <option value="notice">Notice</option>
            <option value="dsar">DSAR (Principal rights)</option>
            <option value="breach_notification">Breach Notification</option>
            <option value="data_retention">Data Retention</option>
          </Select>

          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </Card>

      {/* Data Table */}
      <Card padding={false} className="p-1">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onRowClick={(row) => { setSelectedObligation(row); setInspectOpen(true); }}
          emptyMessage="No privacy logs matching filters recorded."
        />
        <Pagination
          page={page}
          pages={Math.ceil(total / limit)}
          total={total}
          limit={limit}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingObligation ? 'Edit DPDP Obligation Item' : 'Add Act Obligation Item'}
      >
        <PrivacyForm
          obligation={editingObligation}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Inspection Modal */}
      <Modal
        isOpen={inspectOpen}
        onClose={() => setInspectOpen(false)}
        title={selectedObligation ? `Inspect DPDP Check: ${selectedObligation.dpdpSection}` : ''}
      >
        {selectedObligation && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Landmark size={14} className="text-indigo-400" /> Digital Personal Data Protection Act 2023
              </p>
              <h3 className="text-xl font-bold text-slate-200 mt-1">{selectedObligation.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{selectedObligation.description || 'No detailed scope description supplied.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <div>
                <p className="text-xs text-slate-400">Subject Class</p>
                <p className="text-xs font-semibold text-slate-300 mt-1 uppercase">{selectedObligation.dataSubjectCategory || 'End User'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Target Deadline</p>
                <p className="text-xs font-semibold text-slate-300 mt-1 flex justify-center items-center gap-1">
                  <Calendar size={12} className="text-amber-500" />
                  {selectedObligation.dueDate ? new Date(selectedObligation.dueDate).toLocaleDateString() : 'Continuous'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-3">
              <Button onClick={() => setInspectOpen(false)}>Close Inspector</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrivacyObligations;
