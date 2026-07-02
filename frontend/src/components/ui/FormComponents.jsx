import React from 'react';

const inputBase = `
  .sc-input {
    width: 100%;
    padding: 9px 13px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--bg-surface-2);
    color: var(--text-primary);
    font-size: 13.5px;
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    outline: none;
    -webkit-appearance: none;
  }
  .sc-input::placeholder {
    color: var(--text-muted);
  }
  .sc-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light);
    background: var(--bg-surface);
  }
  .sc-input--error {
    border-color: var(--color-danger) !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
  }
  .sc-input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .sc-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .sc-field-error {
    font-size: 11.5px;
    color: var(--color-danger);
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sc-field-helper {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 5px;
  }

  .sc-select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 14px;
    padding-right: 36px;
    cursor: pointer;
  }

  .sc-search-wrap {
    position: relative;
  }
  .sc-search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }
  .sc-search-input {
    padding-left: 34px !important;
  }
`;

/* ── FormField wrapper ── */
export const FormField = ({ label, error, required, children, helper }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {label && (
      <label className="sc-label">
        {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
    )}
    {children}
    {helper && !error && <p className="sc-field-helper">{helper}</p>}
    {error && <p className="sc-field-error">⚠ {error}</p>}
    <style>{inputBase}</style>
  </div>
);

/* ── Input ── */
export const Input = React.forwardRef(({ error, className = '', ...props }, ref) => (
  <>
    <input
      ref={ref}
      className={`sc-input ${error ? 'sc-input--error' : ''} ${className}`}
      {...props}
    />
    <style>{inputBase}</style>
  </>
));
Input.displayName = 'Input';

/* ── Textarea ── */
export const Textarea = React.forwardRef(({ error, className = '', rows = 3, ...props }, ref) => (
  <>
    <textarea
      ref={ref}
      rows={rows}
      className={`sc-input ${error ? 'sc-input--error' : ''} ${className}`}
      style={{ resize: 'vertical' }}
      {...props}
    />
    <style>{inputBase}</style>
  </>
));
Textarea.displayName = 'Textarea';

/* ── Select ── */
export const Select = React.forwardRef(({ error, children, className = '', ...props }, ref) => (
  <>
    <select
      ref={ref}
      className={`sc-input sc-select ${error ? 'sc-input--error' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    <style>{inputBase}</style>
  </>
));
Select.displayName = 'Select';

/* ── Search input ── */
export const SearchInput = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="sc-search-wrap">
    <svg className="sc-search-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="sc-input sc-search-input"
    />
    <style>{inputBase}</style>
  </div>
);
