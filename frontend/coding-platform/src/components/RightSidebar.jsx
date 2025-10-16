// src/components/workspace/RightSidebar.jsx

import React from "react";
import { Users, BrainCircuit, MessageCircle, Lightbulb, Wand2, Sparkles } from "lucide-react";

export default function RightSidebar({
  workspace,
  activePanel,
  onSetActivePanel,
  isAiLoading,
  aiResponse,
  onExplain,
  onFix,
  onGenerate,
}) {
  return (
    <div className="w-72 bg-[#252526] flex flex-col border-l border-neutral-700">
      <div className="flex items-center justify-around border-b border-neutral-700">
        <button onClick={() => onSetActivePanel('ai')} title="AI Assistant" className={`p-3 w-full transition-colors ${activePanel === 'ai' ? 'text-cyan-400 bg-neutral-700/50' : 'text-gray-400 hover:bg-neutral-700/30'}`}><BrainCircuit size={20}/></button>
        <button onClick={() => onSetActivePanel('participants')} title="Participants" className={`p-3 w-full transition-colors ${activePanel === 'participants' ? 'text-cyan-400 bg-neutral-700/50' : 'text-gray-400 hover:bg-neutral-700/30'}`}><Users size={20}/></button>
        <button onClick={() => onSetActivePanel('chat')} title="Chat" className={`p-3 w-full transition-colors ${activePanel === 'chat' ? 'text-cyan-400 bg-neutral-700/50' : 'text-gray-400 hover:bg-neutral-700/30'}`}><MessageCircle size={20}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {activePanel === 'ai' && (
            // MODIFICATION 1: Make this div a full-height flex container
            <div className="h-full flex flex-col">
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider flex-shrink-0">AI Assistant</h3>
                <div className="flex flex-col space-y-2 flex-shrink-0">
                    <button onClick={onExplain} className="flex items-center justify-center space-x-2 bg-green-600/20 hover:bg-green-600/40 text-green-300 text-sm py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!isAiLoading}><Lightbulb size={16} /> <span>{isAiLoading === "explain" ? "Explaining..." : "Explain Code"}</span></button>
                    <button onClick={onFix} className="flex items-center justify-center space-x-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 text-sm py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!isAiLoading}><Wand2 size={16} /> <span>{isAiLoading === "fix" ? "Fixing..." : "Fix Code"}</span></button>
                    <button onClick={onGenerate} className="flex items-center justify-center space-x-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!isAiLoading}><Sparkles size={16} /> <span>{isAiLoading === "generate" ? "Generating..." : "Generate Code"}</span></button>
                </div>
                {/* MODIFICATION 2: Remove fixed height (h-64), add flex-1 to grow, and add internal scrolling */}
                <div className="mt-4 flex-1 bg-[#1e1e1e] p-2.5 rounded text-gray-300 text-sm whitespace-pre-wrap border border-neutral-700 overflow-y-auto">
                    {aiResponse ? aiResponse : "AI response will appear here..."}
                </div>
            </div>
        )}

        {activePanel === 'participants' && (
            <div>
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Participants</h3>
                <div className="space-y-2">
                    {workspace.participants.map((p) => (
                        <div key={p._id} className="flex items-center space-x-2 p-2 bg-neutral-700/50 rounded"><Users size={16}/> <span>{p.username}</span></div>
                    ))}
                </div>
                <button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold py-2 rounded-lg transition-colors">+ Invite Member</button>
            </div>
        )}

        {activePanel === 'chat' && (
            <div className="h-full flex flex-col">
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Chat</h3>
                <div className="flex-1 mb-2 text-center text-gray-500 flex items-center justify-center"><p>Chat UI coming soon...</p></div>
                <input type="text" placeholder="Type a message..." className="w-full p-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
            </div>
        )}
      </div>
    </div>
  );
}