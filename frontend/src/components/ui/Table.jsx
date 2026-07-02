import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const tableStyles = `
  .sc-table-wrap {
    overflow-x: auto;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-surface);
  }
  .sc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .sc-table thead {
    background: var(--bg-surface-2);
    border-bottom: 1px solid var(--border);
  }
  .sc-table thead th {
    padding: 11px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    white-space: nowrap;
  }
  .sc-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.12s ease;
  }
  .sc-table tbody tr:last-child {
    border-bottom: none;
  }
  .sc-table tbody tr:hover {
    background: var(--nav-hover-bg);
  }
  .sc-table tbody tr.sc-table__row--clickable {
    cursor: pointer;
  }
  .sc-table tbody td {
    padding: 12px 16px;
    color: var(--text-secondary);
    vertical-align: middle;
  }
  .sc-table__empty {
    padding: 52px 16px;
    text-align: center;
    color: var(--text-muted);
  }
  .sc-table__empty-icon {
    opacity: 0.35;
    margin: 0 auto 12px;
    display: block;
  }
  .sc-table__empty-text {
    font-size: 13.5px;
  }

  /* Skeleton */
  .sc-table-skel thead th {
    padding: 11px 16px;
  }
  .sc-table-skel tbody td {
    padding: 12px 16px;
  }

  /* Pagination */
  .sc-pagination {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding: 0 4px;
  }
  @media (min-width: 640px) {
    .sc-pagination {
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .sc-pagination__info {
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .sc-pagination__pages {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sc-page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid var(--border-strong);
    background: var(--bg-surface);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 500;
    transition: all 0.15s ease;
  }
  .sc-page-btn:hover:not(:disabled) {
    background: var(--bg-surface-2);
    border-color: var(--border-strong);
    color: var(--text-primary);
  }
  .sc-page-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .sc-page-btn--active {
    background: var(--accent) !important;
    color: #fff !important;
    border-color: var(--accent) !important;
    font-weight: 600;
  }
`;

const Table = ({ columns, data, loading, emptyMessage = 'No records found', onRowClick }) => {
  if (loading) return <TableSkeleton cols={columns.length} />;

  return (
    <div className="sc-table-wrap">
      <table className="sc-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className || ''}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="sc-table__empty">
                  <svg
                    className="sc-table__empty-icon"
                    width="38"
                    height="38"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="sc-table__empty-text">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'sc-table__row--clickable' : ''}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.cellClassName || ''}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{tableStyles}</style>
    </div>
  );
};

export const Pagination = ({ page, pages, total, limit, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="sc-pagination">
      <p className="sc-pagination__info">
        Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="sc-pagination__pages">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="sc-page-btn"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={`sc-page-btn ${page === n ? 'sc-page-btn--active' : ''}`}
            >
              {n}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="sc-page-btn"
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <style>{tableStyles}</style>
    </div>
  );
};

const TableSkeleton = ({ cols }) => (
  <div className="sc-table-wrap sc-table-skel">
    <table className="sc-table">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}>
              <div className="skeleton" style={{ height: 11, width: 60, borderRadius: 5 }} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}>
                <div
                  className="skeleton"
                  style={{ height: 13, width: `${55 + (c * 13) % 35}%`, borderRadius: 5 }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <style>{tableStyles}</style>
  </div>
);

export default Table;
