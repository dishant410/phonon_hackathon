import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const sizeMap = {
  sm: '420px',
  md: '560px',
  lg: '720px',
  xl: '960px',
  full: '1200px',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="sc-modal-overlay"
    >
      <div
        className="sc-modal scale-in"
        style={{ maxWidth: sizeMap[size] || sizeMap.md }}
      >
        {/* Header */}
        <div className="sc-modal__header">
          <h2 className="sc-modal__title">{title}</h2>
          <button onClick={onClose} className="sc-modal__close" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="sc-modal__body">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="sc-modal__footer">{footer}</div>
        )}
      </div>

      <style>{`
        .sc-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.52);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: fadeOverlay 0.18s ease forwards;
        }
        @keyframes fadeOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .sc-modal {
          position: relative;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sc-modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .sc-modal__title {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .sc-modal__close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .sc-modal__close:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .sc-modal__body {
          flex: 1;
          overflow-y: auto;
          padding: 22px;
        }

        .sc-modal__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 22px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--bg-surface-2);
        }
      `}</style>
    </div>
  );
};

export default Modal;
