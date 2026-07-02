import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, MessageSquare, Clock } from 'lucide-react';
import riskService from '../../services/riskService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table, { Pagination } from '../../components/ui/Table';
import { riskLevelBadge, statusBadge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/FormComponents';
import RiskForm from './RiskForm';

const RiskRegister = () => {
  const { isManager } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);

  // Detail panel state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewingRisk, setViewingRisk] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [timeline, setTimeline] = useState([]);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const { data } = await riskService.getAll({
        page,
        limit,
        search,
        category,
        status,
      });
      setData(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      toast.error('Failed to load risk logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, [page, category, status, search]);

  const handleCreateOrUpdate = async (formData) => {
    setFormLoading(true);
    try {
      if (editingRisk) {
        await riskService.update(editingRisk._id, formData);
        toast.success('Risk code modified successfully.');
      } else {
        await riskService.create(formData);
        toast.success('New risk registered.');
      }
      setModalOpen(false);
      fetchRisks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while saving risk.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDetails = async (risk) => {
    try {
      const { data: res } = await riskService.getById(risk._id);
      setViewingRisk(res.data);
      setComments(res.data.activity?.comments || []);
      setTimeline(res.data.activity?.timeline || []);
      setDetailsOpen(true);
    } catch {
      toast.error('Could not load detailed activity logs');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data: res } = await riskService.addComment(viewingRisk._id, newComment);
      setComments(res.data);
      setNewComment('');
      toast.success('Comment post recorded');
    } catch {
      toast.error('Could not post comment');
    }
  };

  const columns = [
    { key: 'title', label: 'Risk Identifier', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">{val}</p>
        <p className="text-xs text-slate-400 capitalize">Cat: {row.category?.replace('_', ' ')}</p>
      </div>
    )},
    { key: 'riskLevel', label: 'Severity Level', render: (val) => riskLevelBadge(val) },
    { key: 'status', label: 'Workflow', render: (val) => statusBadge(val) },
    { key: 'owner', label: 'Assignee / Department', render: (val) => (
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-350">{val?.name || 'Unassigned'}</p>
        <p className="text-xs text-slate-400">{val?.department || 'N/A'}</p>
      </div>
    )},
    {
      key: '_id',
      label: 'Control Action',
      render: (val, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="xs" variant="secondary" onClick={() => handleOpenDetails(row)}>
            Timeline
          </Button>
          {isManager() && (
            <Button size="xs" variant="ghost" onClick={() => { setEditingRisk(row); setModalOpen(true); }}>
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Enterprise Risk Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Log, mitigate, track severity level and SOC2 compliance controls.</p>
        </div>
        {isManager() && (
          <Button onClick={() => { setEditingRisk(null); setModalOpen(true); }}>
            <Plus size={16} /> Add Risk Log
          </Button>
        )}
      </div>

      {/* Filter and Search Panel */}
      <Card padding={false} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search risk summary..."
          />
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            <option value="technical">Technical / Security</option>
            <option value="operational">Operational</option>
            <option value="compliance">Compliance</option>
            <option value="financial">Financial</option>
            <option value="data_privacy">Data Privacy</option>
          </Select>

          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="mitigated">Mitigated</option>
            <option value="accepted">Accepted</option>
          </Select>
        </div>
      </Card>

      {/* Table List Container */}
      <Card padding={false} className="p-1">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onRowClick={(row) => handleOpenDetails(row)}
          emptyMessage="No identified vulnerability or risk registered."
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
        title={editingRisk ? 'Modify Identified Risk' : 'Register New Risk'}
      >
        <RiskForm
          risk={editingRisk}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Detailed Side Panel / Timeline Drawer Modal */}
      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={viewingRisk ? `Detail view: ${viewingRisk.title}` : ''}
        size="lg"
      >
        {viewingRisk && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <div>
                <p className="text-xs text-slate-400">Severity Level</p>
                <div className="mt-1">{riskLevelBadge(viewingRisk.riskLevel)}</div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Score (L x I)</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">{viewingRisk.riskScore || 0} / 16</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Workflow</p>
                <div className="mt-1">{statusBadge(viewingRisk.status)}</div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Assignee</p>
                <p className="mt-1 text-sm font-semibold text-slate-200 truncate">{viewingRisk.owner?.name || '—'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-905 dark:text-slate-100">Mitigation Strategy Plan</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                {viewingRisk.mitigationPlan || 'No mitigation steps defined yet.'}
              </p>
            </div>

            {/* Comments & Timeline Grid split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Comments Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-905 dark:text-slate-100 flex items-center gap-1.5">
                  <MessageSquare size={16} /> Comments ({comments.length})
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2">
                  {comments.map((c, i) => (
                    <div key={i} className="p-2 rounded bg-slate-900/60 border border-slate-850 flex flex-col gap-1">
                      <p className="text-xs text-slate-400 font-medium">{c.author?.name} ({c.author?.role?.replace('_', ' ')})</p>
                      <p className="text-xs text-slate-200">{c.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-xs text-slate-500">No auditor discussion logged.</p>}
                </div>
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask auditor or post note..."
                    className="flex-1 text-xs px-2.5 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button size="xs" type="submit">Send</Button>
                </form>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-905 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock size={16} /> Audit Timeline Logs
                </h4>
                <div className="max-h-56 overflow-y-auto space-y-3 pr-2">
                  {timeline.map((item, i) => (
                    <div key={i} className="relative pl-4 border-l border-slate-700">
                      <div className="absolute left-[-4.5px] top-[5px] w-2 h-2 rounded-full bg-indigo-500" />
                      <p className="text-xs font-semibold text-slate-300">{item.event}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                      <span className="text-[9px] text-indigo-400 tabular-nums">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RiskRegister;
