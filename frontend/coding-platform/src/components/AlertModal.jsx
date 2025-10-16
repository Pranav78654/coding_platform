// src/components/modals/AlertModal.jsx

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#2d2d2d] rounded-lg shadow-xl w-full max-w-md border border-neutral-700 animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" size={20} />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-neutral-300 whitespace-pre-wrap">{message}</p>
        </div>
        <div className="flex justify-end p-4 bg-[#252526] rounded-b-lg border-t border-neutral-700">
          <button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-2 rounded-md transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}