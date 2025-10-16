import React, { useState, useEffect } from 'react';
import { X, Wand2, LoaderCircle } from 'lucide-react';

export default function PromptModal({ isOpen, onClose, onSubmit, title, label }) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset input when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsLoading(true);
    // onSubmit is the function that handles the API call
    onSubmit(inputValue); 
    // We'll let the parent component handle closing and resetting loading state
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#2d2d2d] rounded-lg shadow-xl w-full max-w-lg border border-neutral-700 animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <Wand2 className="text-cyan-400" size={20} />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-neutral-300 mb-2">
              {label}
            </label>
            <textarea
              id="prompt-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., a javascript function to find prime numbers..."
              className="w-full h-24 bg-[#252526] border border-neutral-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              required
            />
          </div>
          <div className="flex justify-end items-center p-4 bg-[#252526] rounded-b-lg border-t border-neutral-700 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-neutral-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50">
              {isLoading && <LoaderCircle size={16} className="animate-spin" />}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
