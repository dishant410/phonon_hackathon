import React from 'react';

// Reusable form field wrapper with label, error, and helper
export const FormField = ({ label, error, required, children, helper }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
    {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
  </div>
);

// Input
export const Input = React.forwardRef(({ error, className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`
      w-full px-3 py-2.5 rounded-lg text-sm
      bg-white dark:bg-slate-900
      border ${error ? 'border-red-400 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'}
      text-slate-900 dark:text-slate-100
      placeholder:text-slate-400 dark:placeholder:text-slate-500
      focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-indigo-500'} focus:border-transparent
      disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed
      transition-colors ${className}
    `}
    {...props}
  />
));
Input.displayName = 'Input';

// Textarea
export const Textarea = React.forwardRef(({ error, className = '', rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={`
      w-full px-3 py-2.5 rounded-lg text-sm resize-none
      bg-white dark:bg-slate-900
      border ${error ? 'border-red-400 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'}
      text-slate-900 dark:text-slate-100
      placeholder:text-slate-400 dark:placeholder:text-slate-500
      focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-indigo-500'} focus:border-transparent
      transition-colors ${className}
    `}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

// Select
export const Select = React.forwardRef(({ error, children, className = '', ...props }, ref) => (
  <select
    ref={ref}
    className={`
      w-full px-3 py-2.5 rounded-lg text-sm
      bg-white dark:bg-slate-900
      border ${error ? 'border-red-400 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'}
      text-slate-900 dark:text-slate-100
      focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-indigo-500'} focus:border-transparent
      transition-colors ${className}
    `}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

// Search input
export const SearchInput = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
    />
  </div>
);
