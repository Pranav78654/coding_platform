import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// Helper function to generate a consistent color from a user ID
const getUserColor = (userId) => {
    if (!userId) return '#FFFFFF';
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - color.length) + color;
};

// Helper to choose white or black text depending on color brightness
const getContrastColor = (hex) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000' : '#fff';
};

export function useRemoteCursors({ editor, monacoInstance, socket, activeFileId }) {
    const { user } = useAuth();
    const otherUserDecorations = useRef({});

    useEffect(() => {
        if (!editor || !socket || !user || !activeFileId || !monacoInstance) return;

        const handleCursorChange = (data) => {
            if (data.userId === user._id || data.fileId !== activeFileId) return;

            const decorations = [];

            // --- 1. Cursor Decoration ---
            if (data.position) {
                decorations.push({
                    range: new monacoInstance.Range(
                        data.position.lineNumber,
                        data.position.column,
                        data.position.lineNumber,
                        data.position.column
                    ),
                    options: {
                        className: `remote-cursor-${data.userId}`,
                        stickiness: monacoInstance.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                        after: {
                            contentText: data.username,
                        },
                    },
                });
            }

            // --- 2. Selection Decoration ---
            const sel = data.selection;
            if (sel && (sel.startLineNumber !== sel.endLineNumber || sel.startColumn !== sel.endColumn)) {
                decorations.push({
                    range: new monacoInstance.Range(
                        sel.startLineNumber,
                        sel.startColumn,
                        sel.endLineNumber,
                        sel.endColumn
                    ),
                    options: {
                        className: `remote-selection-${data.userId}`,
                        stickiness: monacoInstance.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                    },
                });
            }

            // --- 3. Apply decorations ---
            otherUserDecorations.current[data.userId] = editor.deltaDecorations(
                otherUserDecorations.current[data.userId] || [],
                decorations
            );

            // --- 4. Inject custom CSS if not already present ---
            const styleId = `remote-cursor-style-${data.userId}`;
            if (!document.getElementById(styleId)) {
                const style = document.createElement("style");
                style.id = styleId;
                const color = data.color || getUserColor(data.userId);
                const textColor = getContrastColor(color);

                style.innerHTML = `
                    @keyframes blink-${data.userId} {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    .remote-cursor-${data.userId} {
                        position: relative;
                        border-left: 2px solid ${color};
                        animation: blink-${data.userId} 1.2s infinite;
                        z-index: 10;
                        transition: opacity 0.4s ease;
                        font-family: 'Inter', 'Segoe UI', sans-serif;
                    }

                    /* Glowing dot at cursor position */
                    .remote-cursor-${data.userId}::before {
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: -3px;
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: ${color};
                        box-shadow: 0 0 8px ${color}99;
                        z-index: 15;
                    }

                    /* Floating username tag */
                    .remote-cursor-${data.userId}::after {
                        content: '${data.username}';
                        position: absolute;
                        top: -1.6em;
                        left: 6px;
                        background: ${color};
                        color: ${textColor};
                        padding: 2px 8px;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: 500;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
                        transform: translateY(-100%);
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 20;
                        opacity: 0.95;
                        transition: opacity 0.4s ease, transform 0.15s ease-out;
                    }

                    /* Small triangle pointer under tag */
                    .remote-cursor-${data.userId}::before {
                        content: '';
                        position: absolute;
                        top: -4px;
                        left: 12px;
                        border-width: 4px;
                        border-style: solid;
                        border-color: ${color} transparent transparent transparent;
                    }

                    /* Selection highlight */
                    .remote-selection-${data.userId} {
                        background-color: ${color}33;
                        border-radius: 2px;
                    }
                `;
                document.head.appendChild(style);
            }

            // --- 5. Fade out tag when user stops moving ---
            const cursorEls = document.querySelectorAll(`.remote-cursor-${data.userId}`);
            cursorEls.forEach((el) => {
                el.style.opacity = '1';
                clearTimeout(el.fadeTimeout);
                el.fadeTimeout = setTimeout(() => {
                    el.style.opacity = '0.45';
                }, 1500);
            });
        };

        socket.on('cursor-change', handleCursorChange);

        return () => {
            socket.off('cursor-change', handleCursorChange);
            Object.values(otherUserDecorations.current).forEach((decorationSet) => {
                if (editor && decorationSet) {
                    editor.deltaDecorations(decorationSet, []);
                }
            });
            otherUserDecorations.current = {};
        };
    }, [editor, monacoInstance, socket, user, activeFileId]);
}
