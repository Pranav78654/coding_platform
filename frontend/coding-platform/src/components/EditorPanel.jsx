// src/components/workspace/EditorPanel.jsx

import React from "react";
import Editor from "@monaco-editor/react";
import { X, Code2 } from "lucide-react";

export default function EditorPanel({
  activeFile,
  openFiles,
  activeFileId,
  onCloseFile,
  onSetActiveFileId,
  onUpdateFileContent,
  getLanguage,
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Editor Tabs */}
      <div className="flex-shrink-0 bg-[#252526] flex items-center overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file._id}
            className={`flex items-center justify-between pl-3 pr-1 py-1.5 cursor-pointer border-r border-t-2 border-transparent ${
              activeFileId === file._id
                ? "bg-[#1e1e1e] text-white border-t-cyan-400"
                : "bg-[#2d2d2d] text-gray-400 hover:bg-[#333333]"
            }`}
            onClick={() => onSetActiveFileId(file._id)}
          >
            <span className="text-sm mr-2 select-none">
              {file.name}
              {file.isDirty && <span className="text-yellow-400 ml-2">●</span>}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onCloseFile(file._id); }}
              className="p-1 rounded-full hover:bg-neutral-600"
              title="Close File"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 bg-[#1e1e1e] p-1">
        {activeFile ? (
          <Editor
            height="100%"
            theme="vs-dark"
            language={getLanguage(activeFile.name)}
            value={activeFile.content}
            onChange={(value) => onUpdateFileContent(activeFile._id, value || "")}
            options={{
              automaticLayout: true,
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 select-none">
            <Code2 size={60} className="mb-4" />
            <h3 className="text-xl">Welcome to your Workspace</h3>
            <p>Select a file from the explorer to begin editing.</p>
          </div>
        )}
      </div>
    </div>
  );
}