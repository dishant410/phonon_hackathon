import React from 'react';

const Card = ({ children, className = '', hover = false, padding = true }) => (
  <div className={`
    bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
    shadow-sm ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''}
    ${padding ? 'p-6' : ''} ${className}
  `}>
    {children}
  </div>
);

Card.Header = ({ children, className = '', actions }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div className="flex-1">{children}</div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 ${className}`}>
    {children}
  </h3>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export default Card;
