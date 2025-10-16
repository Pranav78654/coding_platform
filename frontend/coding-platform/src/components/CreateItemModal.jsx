import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilePlus2,
  FolderPlus,
  LoaderCircle,
  X,
  AlertCircle,
} from "lucide-react";

export default function CreateItemModal({
  isOpen,
  onClose,
  workspaceId,
  parentId,
  type,
  onItemCreated,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
    }
  }, [isOpen]);

  // Handle keyboard shortcut to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3333/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, parentId, name, type }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create item.");
      }

      onItemCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-[#2D2D2D] border border-neutral-700 p-5 rounded-lg shadow-2xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full text-neutral-400 hover:bg-neutral-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2.5 text-white">
              {type === "file" ? (
                <FilePlus2 size={20} className="text-cyan-400" />
              ) : (
                <FolderPlus size={20} className="text-yellow-400" />
              )}
              Create New {type === "file" ? "File" : "Folder"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label htmlFor="itemName" className="text-sm text-neutral-400 mb-1 block">
                Name
              </label>
              <input
                id="itemName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  type === "file" ? "e.g., app.js" : "e.g., components"
                }
                className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-md mb-3 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                autoFocus
              />
              
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-400 text-sm mb-3 flex items-center gap-1.5"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 w-28 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {loading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}