import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const T_STYLE = `
  .sc-tbl-wrap {
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid #e8edf5;
    background: #fff;
    box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  }
  .sc-tbl {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .sc-tbl thead {
    background: #f8fafc;
    border-bottom: 1px solid #e8edf5;
  }
  .sc-tbl thead th {
    padding: 11px 16px;
    text-align: left;
    font-size: 11px; font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.08em;
    white-space: nowrap;
  }
  .sc-tbl tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.12s ease;
  }
  .sc-tbl tbody tr:last-child { border-bottom: none; }
  .sc-tbl tbody tr:hover { background: #fafbff; }
  .sc-tbl tbody tr.sc-tbl__clickable { cursor: pointer; }
  .sc-tbl tbody tr.sc-tbl__clickable:hover { background: #f5f7ff; }
  .sc-tbl tbody td {
    padding: 12px 16px;
    color: #475569;
    vertical-align: middle;
  }

  /* Empty state */
  .sc-tbl-empty {
    padding: 56px 24px;
    text-align: center;
    color: #94a3b8;
  }
  .sc-tbl-empty svg { opacity: 0.3; margin: 0 auto 14px; display: block; }
  .sc-tbl-empty p { font-size: 13.5px; }

  /* Pagination */
  .sc-pg {
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
    margin-top: 16px; padding: 0 4px;
  }
  @media (min-width: 640px) {
    .sc-pg { flex-direction: row; justify-content: space-between; }
  }
  .sc-pg__info { font-size: 12.5px; color: #94a3b8; }
  .sc-pg__btns { display: flex; align-items: center; gap: 4px; }
  .sc-pg-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    cursor: pointer;
    font-size: 12.5px; font-weight: 600;
    font-family: inherit;
    transition: all 0.15s;
  }
  .sc-pg-btn:hover:not(:disabled) {
    border-color: #c7d2fe; background: #eef2ff; color: #4f46e5;
  }
  .sc-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .sc-pg-btn--active {
    background: linear-gradient(135deg,#4f46e5,#6366f1) !important;
    color: #fff !important; border-color: transparent !important;
    box-shadow: 0 3px 10px rgba(79,70,229,0.30);
  }
`;

const Table = ({ columns, data, loading, emptyMessage = 'No records found', onRowClick }) => {
  if (loading) return <TableSkeleton cols={columns.length} />;
  return (
    <>
      <div className="sc-tbl-wrap">
        <table className="sc-tbl">
          <thead>
            <tr>{columns.map(col => <th key={col.key} className={col.className || ''}>{col.label}</th>)}</tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="sc-tbl-empty">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'sc-tbl__clickable' : ''}
              >
                {columns.map(col => (
                  <td key={col.key} className={col.cellClassName || ''}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{T_STYLE}</style>
    </>
  );
};

export const Pagination = ({ page, pages, total, limit, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <>
      <div className="sc-pg">
        <p className="sc-pg__info">
          Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
        </p>
        <div className="sc-pg__btns">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="sc-pg-btn">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={`sc-pg-btn ${page === n ? 'sc-pg-btn--active' : ''}`}
            >
              {n}
            </button>
          ))}
          <button onClick={() => onPageChange(page + 1)} disabled={page >= pages} className="sc-pg-btn">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <style>{T_STYLE}</style>
    </>
  );
};

const TableSkeleton = ({ cols }) => (
  <>
    <div className="sc-tbl-wrap">
      <table className="sc-tbl">
        <thead>
          <tr>{Array.from({ length: cols }).map((_, i) => (
            <th key={i}><div className="skeleton" style={{ height: 11, width: 60 }} /></th>
          ))}</tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}><div className="skeleton" style={{ height: 13, width: `${55 + (c * 13) % 35}%` }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <style>{T_STYLE}</style>
  </>
);

export default Table;
