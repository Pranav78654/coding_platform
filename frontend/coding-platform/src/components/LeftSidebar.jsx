// src/components/workspace/LeftSidebar.jsx

import React from "react";
import { Link } from "react-router-dom";
import FileExplorer from "./FileExplorer";
import { Files, FilePlus2, FolderPlus } from "lucide-react";

export default function LeftSidebar({
  workspace,
  fileTree,
  activeFileId,
  expandedFolders,
  onOpenCreateModal,
  onItemUpdated,
  onItemDeleted,
  onFileClick,
  onToggleFolder,
}) {
  return (
    <div className="w-64 bg-[#252526] flex flex-col">
      <div className="p-2.5 border-b border-neutral-700">
        <Link to="/dashboard" className="text-xs text-gray-400 hover:text-cyan-400 transition-colors mb-2 block">
          &larr; Back to Dashboard
        </Link>
        <h2 className="text-lg font-bold text-white truncate">{workspace.name}</h2>
      </div>
      <div className="flex items-center justify-between p-2 border-b border-neutral-700">
        <div className="flex items-center space-x-2 text-sm text-gray-400 uppercase tracking-wider">
          <Files size={16} />
          <span>Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => onOpenCreateModal("file")} title="New File" className="p-1 hover:bg-neutral-700 rounded transition-colors">
            <FilePlus2 size={18} />
          </button>
          <button onClick={() => onOpenCreateModal("folder")} title="New Folder" className="p-1 hover:bg-neutral-700 rounded transition-colors">
            <FolderPlus size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {fileTree.length > 0 ? (
          <FileExplorer
            items={fileTree}
            onCreateInside={onOpenCreateModal}
            onItemUpdated={onItemUpdated}
            onItemDeleted={onItemDeleted}
            onFileClick={onFileClick}
            activeFileId={activeFileId}
            expandedFolders={expandedFolders}
            onToggleFolder={onToggleFolder}
          />
        ) : (
          <p className="text-neutral-500 text-sm p-4 text-center">No files or folders.</p>
        )}
      </div>
    </div>
  );
}