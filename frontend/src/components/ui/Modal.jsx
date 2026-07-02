import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const sizeMap = { sm: '420px', md: '560px', lg: '720px', xl: '960px', full: '1200px' };

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        className="sc-modal-overlay"
      >
        <div className="sc-modal scale-in" style={{ maxWidth: sizeMap[size] || sizeMap.md }}>
          <div className="sc-modal__header">
            <h2 className="sc-modal__title">{title}</h2>
            <button onClick={onClose} className="sc-modal__close" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="sc-modal__body">{children}</div>
          {footer && <div className="sc-modal__footer">{footer}</div>}
        </div>
      </div>
      <style>{`
        .sc-modal-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          background: rgba(15,23,42,0.40);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: overlayIn 0.18s ease;
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        .sc-modal {
          position: relative; width: 100%;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(15,23,42,0.16), 0 8px 24px rgba(15,23,42,0.08);
          border: 1px solid #e8edf5;
          max-height: 90vh; display: flex; flex-direction: column;
        }
        .sc-modal__header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .sc-modal__title {
          font-size: 16px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.02em;
        }
        .sc-modal__close {
          width: 30px; height: 30px; border-radius: 8px;
          border: none; background: transparent; color: #94a3b8;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .sc-modal__close:hover { background: #f1f5f9; color: #374151; }
        .sc-modal__body { flex: 1; overflow-y: auto; padding: 22px; }
        .sc-modal__footer {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 10px; padding: 16px 22px;
          border-top: 1px solid #f1f5f9;
          background: #fafbff;
          flex-shrink: 0;
          border-radius: 0 0 20px 20px;
        }
      `}</style>
    </>
  );
};

export default Modal;
