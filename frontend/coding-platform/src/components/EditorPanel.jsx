import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { X, Code2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useRemoteCursors } from "../hooks/useRemoteCursors"; // 1. Import the new custom hook

// Helper to produce a consistent color for the local user
const getUserColor = (userId) => {
    if (!userId) return "#FFFFFF";
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - color.length) + color;
};

export default function EditorPanel({
    activeFile,
    openFiles,
    activeFileId,
    onCloseFile,
    onSetActiveFileId,
    onUpdateFileContent,
    getLanguage,
    workspaceId,
}) {
    const { user } = useAuth();
    const { socket } = useSocket();

    const [editor, setEditor] = useState(null);
    const [monacoInstance, setMonacoInstance] = useState(null);

    // 2. Call the custom hook to handle all incoming cursor/selection logic
    useRemoteCursors({ editor, monacoInstance, socket, activeFileId });

    const handleEditorDidMount = useCallback((editorInstance, monaco) => {
        setEditor(editorInstance);
        setMonacoInstance(monaco);
    }, []);

    // Effect for SENDING your own cursor changes
    useEffect(() => {
        if (!editor || !socket || !user || !activeFile) return;

        let throttleTimeout = null;
        const emitCursorChange = () => {
            const position = editor.getPosition();
            const selection = editor.getSelection();
            const cursorData = {
                workspaceId,
                fileId: activeFile._id,
                userId: user._id,
                username: user.username,
                position,
                selection,
                color: getUserColor(user._id),
            };
            socket.emit("cursor-change", cursorData);
        };

        const onPositionOrSelectionChange = () => {
            if (throttleTimeout) return;
            throttleTimeout = setTimeout(() => {
                emitCursorChange();
                throttleTimeout = null;
            }, 50); // Throttle to send updates max every 50ms
        };

        const disposables = [
            editor.onDidChangeCursorPosition(onPositionOrSelectionChange),
            editor.onDidChangeCursorSelection(onPositionOrSelectionChange),
        ];

        return () => {
            disposables.forEach(d => d.dispose());
            if (throttleTimeout) clearTimeout(throttleTimeout);
        };
    }, [editor, socket, user, activeFile, workspaceId]);

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-shrink-0 bg-[#252526] flex items-center overflow-x-auto">
                {openFiles.map((file) => (
                    <div
                        key={file._id}
                        className={`flex items-center justify-between pl-3 pr-1 py-1.5 cursor-pointer border-r border-t-2 border-transparent ${activeFileId === file._id ? "bg-[#1e1e1e] text-white border-t-cyan-400" : "bg-[#2d2d2d] text-gray-400 hover:bg-[#333333]"}`}
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

            <div className="flex-1 bg-[#1e1e1e] p-1">
                {activeFile ? (
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        path={activeFile._id}
                        language={getLanguage(activeFile.name)}
                        value={activeFile.content}
                        onMount={handleEditorDidMount}
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
