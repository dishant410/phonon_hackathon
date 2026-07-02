import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Download, FileText, ArrowRight, History, Check, X, ShieldAlert } from 'lucide-react';
import policyService from '../../services/policyService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table, { Pagination } from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/FormComponents';

const PolicyManagement = () => {
  const { user, isManager } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form payload
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [policyCategory, setPolicyCategory] = useState('security');
  const [file, setFile] = useState(null);

  // History modal
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedPolicyTitle, setSelectedPolicyTitle] = useState('');

  // Review state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const { data: res } = await policyService.getAll({
        page,
        limit,
        status,
        category,
        search,
      });
      setData(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load corporate GRC policy handbook');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [page, status, category]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Policy document file is required.');
      return;
    }
    setActionLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', policyCategory);
    formData.append('owner', user._id);
    formData.append('file', file);

    try {
      await policyService.create(formData);
      toast.success('Grc policy record logged successfully.');
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
      fetchPolicies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while saving policy doc.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenHistory = async (policy) => {
    try {
      setSelectedPolicyTitle(policy.title);
      const { data: res } = await policyService.getHistory(policy._id);
      setHistoryData(res.data || []);
      setHistoryOpen(true);
    } catch {
      toast.error('Failed to load version logs.');
    }
  };

  const handleReviewAction = async (action) => {
    if (!selectedPolicy) return;
    setActionLoading(true);
    try {
      await policyService.review(selectedPolicy._id, action, rejectionReason);
      toast.success(`Policy evaluation marked as ${action === 'approve' ? 'Approved' : 'Rejected'}.`);
      setReviewOpen(false);
      setSelectedPolicy(null);
      setRejectionReason('');
      fetchPolicies();
    } catch {
      toast.error('Could not log your approval status.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Policy Document', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-205">{val}</p>
        <p className="text-xs text-slate-400 capitalize">Category: {row.category}</p>
      </div>
    )},
    { key: 'currentVersion', label: 'Version', cellClassName: 'font-mono text-xs' },
    { key: 'status', label: 'Status', render: (val) => statusBadge(val) },
    { key: 'approvalStatus', label: 'Approval status', render: (val) => statusBadge(val) },
    { key: 'owner', label: 'Owner Assignee', render: (val) => val?.name || '—' },
    {
      key: '_id',
      label: 'Grc Actions',
      render: (val, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={row.fileUrl ? `http://localhost:5000${row.fileUrl}` : '#'}
            target="_blank"
            rel="noreferrer"
            download
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-205 border border-slate-700/50"
          >
            <Download size={13} /> Get Doc
          </a>
          <Button size="xs" variant="secondary" onClick={() => handleOpenHistory(row)}>
            <History size={13} /> Versions
          </Button>
          {isManager() && row.approvalStatus === 'pending' && (
            <Button size="xs" variant="primary" onClick={() => { setSelectedPolicy(row); setReviewOpen(true); }}>
              Sign-Off
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Corporate Policy Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Implement SOC 2 audit policies, employee handbooks, privacy notices and version logs.</p>
        </div>
        {isManager() && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Register Policy Doc
          </Button>
        )}
      </div>

      {/* Filter toolbar */}
      <Card padding={false} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policy titles..."
          />
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All policy classes</option>
            <option value="security">Information Security</option>
            <option value="privacy">Privacy (DPDP Consent etc)</option>
            <option value="compliance">Corporate Compliance</option>
            <option value="hr">HR & Employee Rules</option>
          </Select>

          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">Under Review</option>
            <option value="active">Active</option>
          </Select>
        </div>
      </Card>

      {/* Table grid */}
      <Card padding={false} className="p-1">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage="No organizational policies registered."
        />
        <Pagination
          page={page}
          pages={Math.ceil(total / limit)}
          total={total}
          limit={limit}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* Register policy doc Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Upload Compliance Policy Document"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Policy Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Identity and Access Control Policy v1.0"
              className="w-full text-xs px-3 py-2.5 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Policy Category</label>
            <Select value={policyCategory} onChange={(e) => setPolicyCategory(e.target.value)}>
              <option value="security">Information Security Policy</option>
              <option value="privacy">Privacy Policy (Consent notice templates)</option>
              <option value="compliance">Compliance Policy</option>
              <option value="hr">HR Policy</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a summary of the targets covered by this validation document class..."
              className="w-full text-xs px-3 py-2.5 rounded bg-slate-900 border border-slate-700 text-slate-205 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400">Document Upload (.pdf, .docx, .txt)</label>
            <input
              type="file"
              required
              onChange={handleFileChange}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-900/40 file:text-indigo-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/50">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={actionLoading}>
              Upload Log
            </Button>
          </div>
        </form>
      </Modal>

      {/* History Version Logs Modal */}
      <Modal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`Version Log: ${selectedPolicyTitle}`}
      >
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-3">
            {historyData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                    v{item.version}
                  </span>
                  <p className="text-xs leading-relaxed text-slate-400 mt-1">{item.fileName}</p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <p>Uploaded by: {item.uploadedBy?.name}</p>
                  <p>{new Date(item.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setHistoryOpen(false)}>Close Log</Button>
          </div>
        </div>
      </Modal>

      {/* Review Signoff Signoff Modal */}
      <Modal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={selectedPolicy ? `Evaluate policy: ${selectedPolicy.title}` : ''}
        footer={
          <div className="flex gap-2 w-full justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldAlert size={14} className="text-indigo-400" /> Action locks publication
            </span>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={() => handleReviewAction('reject')} loading={actionLoading}>
                <X size={14} /> Send Back / Reject
              </Button>
              <Button variant="success" size="sm" onClick={() => handleReviewAction('approve')} loading={actionLoading}>
                <Check size={14} /> Approve Sign-Off
              </Button>
            </div>
          </div>
        }
      >
        {selectedPolicy && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">Policy Category</p>
              <p className="text-sm font-semibold capitalize text-slate-205 mt-1">{selectedPolicy.category}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Description Summary</p>
              <p className="text-xs text-slate-350 mt-1 bg-slate-900 border border-slate-800 p-3 rounded">{selectedPolicy.description || 'No summary text.'}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 text-left">Signoff Auditor Notes</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Declare alignment with SOC2 constraints or corrective changes needed..."
                className="w-full text-xs px-3 py-2.5 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PolicyManagement;
