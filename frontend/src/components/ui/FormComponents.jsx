import React from 'react';

const baseStyle = `
  .sc-label {
    display: block;
    font-size: 12.5px; font-weight: 700;
    color: #374151;
    margin-bottom: 6px;
    letter-spacing: 0.005em;
  }
  .sc-field-error {
    font-size: 11.5px; color: #ef4444;
    margin-top: 5px;
    display: flex; align-items: center; gap: 4px;
  }
  .sc-field-helper {
    font-size: 11.5px; color: #94a3b8; margin-top: 5px;
  }
  .sc-input {
    width: 100%;
    padding: 9px 13px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    color: #0f172a;
    font-size: 13.5px;
    font-family: inherit;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
    outline: none;
    -webkit-appearance: none;
  }
  .sc-input::placeholder { color: #cbd5e1; }
  .sc-input:focus {
    border-color: #4f46e5;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
  }
  .sc-input:disabled {
    opacity: 0.5; cursor: not-allowed;
    background: #f1f5f9;
  }
  .sc-input--error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.10) !important;
  }
  .sc-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 11px center;
    background-size: 13px;
    padding-right: 36px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
  }
  .sc-search-wrap { position: relative; }
  .sc-search-icon {
    position: absolute; left: 11px; top: 50%;
    transform: translateY(-50%); color: #94a3b8;
    pointer-events: none;
  }
  .sc-search-input { padding-left: 34px !important; }
`;

export const FormField = ({ label, error, required, children, helper }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {label && (
      <label className="sc-label">
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    {children}
    {helper && !error && <p className="sc-field-helper">{helper}</p>}
    {error && <p className="sc-field-error">⚠ {error}</p>}
    <style>{baseStyle}</style>
  </div>
);

export const Input = React.forwardRef(({ error, className = '', ...props }, ref) => (
  <>
    <input ref={ref} className={`sc-input ${error ? 'sc-input--error' : ''} ${className}`} {...props} />
    <style>{baseStyle}</style>
  </>
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ error, className = '', rows = 3, ...props }, ref) => (
  <>
    <textarea
      ref={ref} rows={rows}
      className={`sc-input ${error ? 'sc-input--error' : ''} ${className}`}
      style={{ resize: 'vertical' }}
      {...props}
    />
    <style>{baseStyle}</style>
  </>
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ error, children, className = '', ...props }, ref) => (
  <>
    <select
      ref={ref}
      className={`sc-input sc-select ${error ? 'sc-input--error' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    <style>{baseStyle}</style>
  </>
));
Select.displayName = 'Select';

export const SearchInput = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="sc-search-wrap">
    <svg className="sc-search-icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text" value={value} onChange={onChange} placeholder={placeholder}
      className="sc-input sc-search-input"
    />
    <style>{baseStyle}</style>
  </div>
);
