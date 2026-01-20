
import React from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg m-4">
      <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white" aria-label="Zamknij">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Potwierdź", confirmColor = "red" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md m-4 p-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Anuluj</button>
          <button onClick={onConfirm} className={`px-4 py-2 bg-${confirmColor}-600 text-white font-semibold text-sm rounded-md hover:bg-${confirmColor}-700 transition-colors`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
    <div>{children}</div>
  </div>
);

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center px-4 py-2 bg-[var(--theme-600)] text-white font-semibold text-sm rounded-md shadow-sm hover:bg-[var(--theme-700)] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);
