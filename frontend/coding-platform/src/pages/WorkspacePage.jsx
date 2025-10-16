// src/pages/WorkspacePage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import CreateItemModal from "../components/CreateItemModal";
import { useAlert } from "../context/AlertContext"; // 1. Import useAlert
import { usePrompt } from "../context/PromptContext";
// --- Import UI and Child Components ---
import LeftSidebar from "../components/LeftSidebar";
import EditorPanel from "../components/EditorPanel";
import RightSidebar from "../components/RightSidebar";
import { LoaderCircle, AlertTriangle } from "lucide-react";

// --- Custom Hooks for State Management (Optional but Recommended) ---
// You could move related state and functions into custom hooks like useEditorState, useFileTreeState, etc.
// For now, we'll keep them here for clarity.

export default function WorkspacePage() {
    const { workspaceId } = useParams();
    const [workspace, setWorkspace] = useState(null);
    const [fileTree, setFileTree] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  const { showAlert } = useAlert(); // 2. Get the showAlert function
const { showPrompt } = usePrompt();
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("file");
    const [modalParentId, setModalParentId] = useState(null);

    // Editor State
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFileId, setActiveFileId] = useState(null);

    // File Explorer UI State
    const [expandedFolders, setExpandedFolders] = useState([]);

    // AI Response State
    const [aiResponse, setAiResponse] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Right Panel UI State
    const [activeRightPanel, setActiveRightPanel] = useState("ai"); // 'ai', 'participants', or 'chat'

    // Save debounce refs
    const saveTimeouts = useRef({});

    // --- DATA FETCHING ---
    const fetchWorkspaceData = async () => {
        setIsLoading(true);
        try {
            const [wsRes, filesRes] = await Promise.all([
                fetch(`http://localhost:3333/api/work/${workspaceId}`, { credentials: "include" }),
                fetch(`http://localhost:3333/api/files/workspace/${workspaceId}`, { credentials: "include" }),
            ]);

            if (!wsRes.ok || !filesRes.ok) throw new Error("Failed to load workspace data");

            const wsData = await wsRes.json();
            const fileData = await filesRes.json();

            setWorkspace(wsData);
            setFileTree(fileData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaceData();
    }, [workspaceId]);

    // --- MODAL HANDLERS ---
    const openCreateModal = (type, parentId = null) => {
        setModalType(type);
        setModalParentId(parentId);
        setIsModalOpen(true);
    };

    const handleItemCreated = () => {
        if (modalParentId && !expandedFolders.includes(modalParentId)) {
            setExpandedFolders(prev => [...prev, modalParentId]);
        }
        fetchWorkspaceData();
    };

    // --- FILE EXPLORER HANDLERS ---
    const handleItemUpdated = () => fetchWorkspaceData();
    const handleItemDeleted = () => fetchWorkspaceData();
    const handleToggleFolder = (folderId) => {
        setExpandedFolders((prev) =>
            prev.includes(folderId)
                ? prev.filter((id) => id !== folderId)
                : [...prev, folderId]
        );
    };

    // --- EDITOR HANDLERS ---
    const openFile = async (file) => {
        if (openFiles.some((f) => f._id === file._id)) {
            setActiveFileId(file._id);
            return;
        }
        try {
            const res = await fetch(`http://localhost:3333/api/files/${file._id}`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch file content");
            const data = await res.json();
            setOpenFiles((prev) => [...prev, { ...file, content: data.content, isDirty: false }]);
            setActiveFileId(file._id);
        } catch (err) {
            console.error("Could not load file content:", err);
        }
    };

    const closeFile = (fileId) => {
        setOpenFiles((prev) => {
            const newOpenFiles = prev.filter((f) => f._id !== fileId);
            if (activeFileId === fileId) {
                setActiveFileId(newOpenFiles.length > 0 ? newOpenFiles[0]._id : null);
            }
            return newOpenFiles;
        });
    };

    const saveFile = async (fileId) => {
        const file = openFiles.find((f) => f._id === fileId);
        if (!file || !file.isDirty) return;

        try {
            const res = await fetch(`http://localhost:3333/api/files/${fileId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: file.content }),
            });
            if (!res.ok) throw new Error("Failed to save file");
            setOpenFiles((prev) =>
                prev.map((f) => (f._id === fileId ? { ...f, isDirty: false } : f))
            );
        } catch (err) {
            console.error("Error saving file:", err);
        }
    };
    
    const updateFileContent = (fileId, content) => {
        setOpenFiles((prev) =>
            prev.map((f) => (f._id === fileId ? { ...f, content, isDirty: true } : f))
        );
        if (saveTimeouts.current[fileId]) clearTimeout(saveTimeouts.current[fileId]);
        saveTimeouts.current[fileId] = setTimeout(() => saveFile(fileId), 1000);
    };
    
    const activeFile = openFiles.find((f) => f._id === activeFileId);

    // --- AI HANDLERS & HELPERS ---
    const getLanguage = (fileName) => {
        if (!fileName) return "plaintext";
        const extension = fileName.split(".").pop();
        switch (extension) {
            case "js": case "jsx": return "javascript";
            case "ts": case "tsx": return "typescript";
            case "html": return "html";
            case "css": return "css";
            case "json": return "json";
            case "py": return "python";
            case "md": return "markdown";
            default: return "plaintext";
        }
    };
    
    const handleAIFetch = async (endpoint, body, loadingType) => {
        if (!activeFile && endpoint !== 'generate') return showAlert("Open a file first!");
        
        setIsAiLoading(loadingType);
        setAiResponse("");
        
        try {
            const res = await fetch(`http://localhost:3333/api/gemini/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            const data = await res.json();
            const responseText = data.explanation || data.fixedCode || data.code || "No response from AI.";
            setAiResponse(responseText);
        } catch (err) {
            console.error(err);
            setAiResponse(`An error occurred while performing the action: ${loadingType}.`);
        } finally {
            setIsAiLoading(null);
        }
    };
    
    const handleExplain = () => handleAIFetch('explain', { code: activeFile.content, language: getLanguage(activeFile.name) }, 'explain');
    const handleFix = () => handleAIFetch('fix', { code: activeFile.content, language: getLanguage(activeFile.name) }, 'fix');
    const handleGenerate = () => {
        showPrompt({
            title: "Generate Code with AI",
            label: "Describe the code you want to generate:",
            onSubmit: (userPrompt) => {
                if (userPrompt) {
                    handleAIFetch('generate', { prompt: userPrompt, language: getLanguage(activeFile?.name) }, 'generate');
                }
            }
        });
    };

    // --- RENDER LOGIC ---
    if (isLoading) return ( <div className="..."><LoaderCircle /></div> );
    if (error) return ( <div className="..."><AlertTriangle /></div> );
    if (!workspace) return ( <div className="..."><Link to="/dashboard">Go to Dashboard</Link></div> );

    return (
        <div className="flex h-[calc(100vh-120px)] bg-[#1e1e1e] text-gray-300 font-sans">
            <LeftSidebar
                workspace={workspace}
                fileTree={fileTree}
                activeFileId={activeFileId}
                expandedFolders={expandedFolders}
                onOpenCreateModal={openCreateModal}
                onItemUpdated={handleItemUpdated}
                onItemDeleted={handleItemDeleted}
                onFileClick={openFile}
                onToggleFolder={handleToggleFolder}
            />

            <EditorPanel
                activeFile={activeFile}
                openFiles={openFiles}
                activeFileId={activeFileId}
                onCloseFile={closeFile}
                onSetActiveFileId={setActiveFileId}
                onUpdateFileContent={updateFileContent}
                getLanguage={getLanguage}
            />

            <RightSidebar
                workspace={workspace}
                activePanel={activeRightPanel}
                onSetActivePanel={setActiveRightPanel}
                isAiLoading={isAiLoading}
                aiResponse={aiResponse}
                onExplain={handleExplain}
                onFix={handleFix}
                onGenerate={handleGenerate}
            />

            <CreateItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                workspaceId={workspaceId}
                parentId={modalParentId}
                type={modalType}
                onItemCreated={handleItemCreated}
            />
        </div>
    );
}