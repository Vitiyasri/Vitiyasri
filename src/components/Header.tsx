import React from "react";
import { Sparkles, Plus, FileText, Zap, History } from "lucide-react";

interface HeaderProps {
  onNewChat: () => void;
  onOpenSystemPrompt: () => void;
  onOpenTranscript: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onOpenSystemPrompt,
  onOpenTranscript,
  messageCount,
}) => {
  return (
    <header id="echo-app-header" className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Echo AI
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v3.6
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400 font-medium">Online</span>
              <span className="text-slate-600">•</span>
              <span>AI Assistant</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1.5 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini 3.6 Flash</span>
          </div>

          <button
            id="header-transcript-btn"
            onClick={onOpenTranscript}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer"
            title="View Chat History & Transcript"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Transcript</span>
          </button>

          <button
            id="header-system-prompt-btn"
            onClick={onOpenSystemPrompt}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer"
            title="View Echo System Prompt Rules"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Echo Rules</span>
          </button>

          <button
            id="header-new-chat-btn"
            onClick={onNewChat}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            title="Start a new chat conversation"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
