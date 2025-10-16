import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileText,
  FileCode2,
  FileJson2,
  FileImage,
  Plus,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash,
  Swords, // for game assets ;)
  Palette, // for css
} from "lucide-react";

// --- Main Component ---
export default function FileExplorer({
  items,
  onCreateInside,
  onItemUpdated,
  onItemDeleted,
  onFileClick,
  activeFileId,
}) {
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [renamingItem, setRenamingItem] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Toggle folder expand/collapse
  const toggleFolder = (id) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Improved file icon mapping
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "html":
        return <FileCode2 size={16} className="text-orange-400" />;
      case "css":
        return <Palette size={16} className="text-sky-400" />;
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode2 size={16} className="text-yellow-400" />;
      case "json":
        return <FileJson2 size={16} className="text-yellow-400" />;
      case "md":
        return <FileText size={16} className="text-cyan-400" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <FileImage size={16} className="text-purple-400" />;
      case "exe":
        return <Swords size={16} className="text-green-400" />;
      default:
        return <FileText size={16} className="text-neutral-400" />;
    }
  };

  // --- Handlers (Unchanged) ---
  // All your handler functions (handleRename, handleDelete, etc.) remain unchanged.
  // ...
  const handleRename = async (itemId, newName) => {
 if (!newName.trim()) return;
 try {
 await fetch(`http://localhost:3333/api/files/${itemId}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ name: newName }),
 credentials: "include",
 });
 setRenamingItem(null);
 onItemUpdated?.();
 } catch (err) {
 console.error("Rename failed:", err);
 }
};

 const handleDelete = async (itemId) => {
 if (!window.confirm("Are you sure you want to delete this item?")) return;
 try {
  await fetch(`http://localhost:3333/api/files/${itemId}`, {
   method: "DELETE",
   credentials: "include",
  });
  onItemDeleted?.();
 } catch (err) {
  console.error("Delete failed:", err);
 }
 };

 const handleDragStart = (e, item) => {
 e.dataTransfer.setData("itemId", item._id);
 };
  
 const handleDrop = async (e, targetFolder) => {
 e.preventDefault();
 const draggedId = e.dataTransfer.getData("itemId");
 if (draggedId === targetFolder._id) return;
 try {
 await fetch(`http://localhost:3333/api/files/${draggedId}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ parentId: targetFolder._id }),
 credentials: "include",
 });
 onItemUpdated?.();
 } catch (err) {
  console.error("Move failed:", err);
 }
 };

  // Close context menu on any click
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);
  

  // --- Recursive Tree Rendering Component ---
  const TreeItem = ({ item }) => {
    const isFolder = item.type === "folder";
    const isExpanded = expandedFolders.includes(item._id);
    const isRenaming = renamingItem === item._id;

    return (
      <div className="my-0.5"
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => isFolder && handleDrop(e, item)}
      >
        {/* Main item row */}
        <div
          className={`group flex items-center justify-between pl-2 pr-1 py-0.5 rounded cursor-pointer transition-colors ${
            activeFileId === item._id
              ? "bg-neutral-700/80 text-white"
              : "hover:bg-neutral-700/60"
          }`}
          onClick={() => (isFolder ? toggleFolder(item._id) : onFileClick?.(item))}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({ x: e.clientX, y: e.clientY, item: item });
          }}
        >
          {/* Icon and Name */}
          <div className="flex items-center space-x-1 truncate">
            {isFolder ? (
              isExpanded ? <ChevronDown size={16} className="opacity-70"/> : <ChevronRight size={16} className="opacity-70"/>
            ) : (
              <span className="w-[16px]" /> // Placeholder for alignment
            )}
            {isFolder ? (
              isExpanded ? (
                <FolderOpen size={16} className="text-yellow-400" />
              ) : (
                <Folder size={16} className="text-yellow-400" />
              )
            ) : (
              getFileIcon(item.name)
            )}

            {isRenaming ? (
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleRename(item._id, renameValue)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(item._id, renameValue)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-900 rounded px-1 text-sm focus:ring-1 focus:ring-cyan-500 outline-none w-32"
              />
            ) : (
              <span className="text-sm truncate select-none">{item.name}</span>
            )}
          </div>

          {/* Action buttons - appear on hover */}
          <div className="hidden group-hover:flex items-center">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setRenamingItem(item._id);
                    setRenameValue(item.name);
                }}
                className="p-1 rounded hover:bg-neutral-600"
                title="Rename"
            >
                <Edit size={14} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                }}
                className="p-1 rounded hover:bg-neutral-600 text-neutral-400 hover:text-red-400"
                title="Delete"
            >
                <Trash size={14} />
            </button>
          </div>
        </div>

        {/* Children with animation and indentation guide */}
        <AnimatePresence initial={false}>
          {isFolder && isExpanded && item.children?.length > 0 && (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative pl-5"
            >
              {/* Indentation guide line */}
              <div className="absolute left-[13px] top-0 h-full border-l border-neutral-700/60" />
              {item.children.map((child) => (
                <TreeItem key={child._id} item={child} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (!items?.length)
    return (
      <p className="text-neutral-500 text-sm px-2 py-4 text-center">
        No files yet.
      </p>
    );

  return (
    <div className="relative select-none p-1">
      {items.map((item) => (
        <TreeItem key={item._id} item={item} />
      ))}

      {/* --- Upgraded Context Menu --- */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-md shadow-xl p-1 text-sm text-neutral-200 w-44"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {contextMenu.item.type === "folder" && (
            <>
              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-cyan-500/20 hover:text-cyan-300"
                onClick={() => onCreateInside("file", contextMenu.item._id)}
              >
                <Plus size={16} /> New File
              </button>
              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-cyan-500/20 hover:text-cyan-300"
                onClick={() => onCreateInside("folder", contextMenu.item._id)}
              >
                <Folder size={16} /> New Folder
              </button>
              <div className="h-px bg-neutral-700 my-1" /> {/* Divider */}
            </>
          )}
          <button
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-cyan-500/20 hover:text-cyan-300"
            onClick={() => {
              setRenamingItem(contextMenu.item._id);
              setRenameValue(contextMenu.item.name);
            }}
          >
            <Edit size={16} /> Rename
          </button>
          <button
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-red-500/20 hover:text-red-400"
            onClick={() => handleDelete(contextMenu.item._id)}
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}