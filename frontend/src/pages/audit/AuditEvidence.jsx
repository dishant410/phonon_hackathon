import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, FileDown, Search, Check, X, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table, { Pagination } from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/FormComponents';
import EvidenceForm from './EvidenceForm';

const AuditEvidence = () => {
  const { user, isManager } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');

  // Modals state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Review states
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [comments, setComments] = useState('');

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get('/audit', {
        params: { page, limit, reviewStatus }
      });
      setData(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load submitted evidence archive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [page, reviewStatus]);

  const handleUploadSubmit = async (formData) => {
    setActionLoading(true);
    try {
      await api.post('/audit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Evidence successfully uploaded and logged.');
      setUploadOpen(false);
      fetchEvidence();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit evidence file.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewAction = async (status) => {
    if (!selectedEvidence) return;
    setActionLoading(true);
    try {
      await api.put(`/audit/${selectedEvidence._id}/review`, {
        reviewStatus: status,
        reviewComments: comments
      });
      toast.success(`Evidence evaluation marked as ${status}.`);
      setReviewOpen(false);
      setSelectedEvidence(null);
      setComments('');
      fetchEvidence();
    } catch {
      toast.error('Could not log your approval status.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Item Identifier', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-205">{val}</p>
        <p className="text-xs text-slate-400 capitalize">Type: {row.evidenceType}</p>
      </div>
    )},
    { key: 'control', label: 'Ref Control', render: (val) => (
      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700/50 text-indigo-400">
        {val?.controlId || 'G-00'}
      </span>
    )},
    { key: 'period', label: 'Period' },
    { key: 'reviewStatus', label: 'Approval Status', render: (val) => statusBadge(val) },
    { key: 'uploadedBy', label: 'Collector Officer', render: (val) => val?.name || '—' },
    {
      key: '_id',
      label: 'Actions / Audit Details',
      render: (val, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={row.fileUrl ? `http://localhost:5000${row.fileUrl}` : '#'}
            target="_blank"
            rel="noreferrer"
            download
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 outline-none rounded bg-slate-800 border border-slate-700 text-slate-205 hover:bg-slate-700/70"
          >
            <FileDown size={14} /> Download
          </a>
          {isManager() && row.reviewStatus === 'pending' && (
            <Button size="xs" variant="primary" onClick={() => { setSelectedEvidence(row); setReviewOpen(true); }}>
              Evaluate
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Audit Evidence Room</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Upload system configurations, logs, snapshots and sign-offs for external GRC auditors.</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload size={16} /> Submit Evidence File
        </Button>
      </div>

      {/* Filter toolbar */}
      <Card padding={false} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search evidence entries..."
          />
        </div>
        <div className="w-full md:w-auto">
          <Select value={reviewStatus} onChange={(e) => { setReviewStatus(e.target.value); setPage(1); }}>
            <option value="">All Review Statuses</option>
            <option value="pending">Pending Evaluation</option>
            <option value="approved">Approved / Clean</option>
            <option value="rejected">Rejected / Needs Action</option>
          </Select>
        </div>
      </Card>

      {/* Data Table */}
      <Card padding={false} className="p-1">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage="No evidence files mapped or uploaded yet."
        />
        <Pagination
          page={page}
          pages={Math.ceil(total / limit)}
          total={total}
          limit={limit}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* Submit Evidence Modal */}
      <Modal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Submit New Evidence Log"
      >
        <EvidenceForm
          onSubmit={handleUploadSubmit}
          onCancel={() => setUploadOpen(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Evaluate Evidence Modal */}
      <Modal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={selectedEvidence ? `Evaluate Item: ${selectedEvidence.title}` : ''}
        footer={
          <div className="flex gap-2 w-full justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldAlert size={14} className="text-indigo-400" /> Action cannot be undone
            </span>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={() => handleReviewAction('rejected')} loading={actionLoading}>
                <X size={14} /> Reject Item
              </Button>
              <Button variant="success" size="sm" onClick={() => handleReviewAction('approved')} loading={actionLoading}>
                <Check size={14} /> Approve Item
              </Button>
            </div>
          </div>
        }
      >
        {selectedEvidence && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">Assigned Control Reference Code</p>
              <p className="text-sm font-semibold text-slate-201 mt-1">{selectedEvidence.control?.controlId} - {selectedEvidence.control?.title}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Submitting Officer Comment</p>
              <p className="text-xs text-slate-350 mt-1 bg-slate-900 border border-slate-800 p-3 rounded">{selectedEvidence.description || 'No comment provided.'}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Auditor Evaluation Notes</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Declare sign-off terms or log correction directions..."
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

export default AuditEvidence;
