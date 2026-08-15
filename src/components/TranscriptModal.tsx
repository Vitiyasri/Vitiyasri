import React, { useState } from "react";
import { ChatMessageData, ChatSession } from "../types";
import { X, Copy, Check, Download, History, MessageSquare, Trash2, Plus, FileText, Sparkles } from "lucide-react";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMessages: ChatMessageData[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  currentMessages,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}) => {
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "history">("transcript");

  if (!isOpen) return null;

  // Format full chat history text transcript
  const generateTranscriptText = (msgs: ChatMessageData[]): string => {
    if (msgs.length === 0) return "No messages in transcript yet.";

    return msgs
      .map((m) => {
        const sender = m.role === "user" ? "USER" : "ECHO AI";
        const time = typeof m.timestamp === "string" ? m.timestamp : new Date(m.timestamp).toLocaleString();
        return `[${time}] ${sender}:\n${m.content}\n${"-".repeat(40)}`;
      })
      .join("\n\n");
  };

  const transcriptText = generateTranscriptText(currentMessages);

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(transcriptText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `echo-ai-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="transcript-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div id="transcript-modal-card" className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Chat History & Transcript
              </h2>
              <p className="text-xs text-slate-400">View transcripts, copy chat logs, and switch past sessions</p>
            </div>
          </div>
          <button
            id="close-transcript-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between px-4 pt-3 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("transcript")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "transcript"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Current Transcript</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "history"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Saved History ({sessions.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all cursor-pointer mb-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === "transcript" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Conversation Text
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id="copy-transcript-btn"
                    onClick={handleCopyTranscript}
                    disabled={currentMessages.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-indigo-600/40 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
                  >
                    {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTranscript ? "Copied!" : "Copy Full Transcript"}</span>
                  </button>

                  <button
                    id="download-transcript-btn"
                    onClick={handleDownloadTranscript}
                    disabled={currentMessages.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              {/* Text transcript view */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto selection:bg-indigo-500 selection:text-white">
                {transcriptText}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Previous Conversations
              </span>

              {sessions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <History className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No previous chat sessions saved yet.</p>
                  <p className="text-slate-500">Your chat history automatically saves as you talk to Echo AI.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        sess.id === currentSessionId
                          ? "bg-indigo-950/40 border-indigo-500/60 text-white"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectSession(sess);
                          onClose();
                        }}
                        className="flex-1 text-left flex items-start gap-2.5 cursor-pointer min-w-0"
                      >
                        <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate text-slate-100">{sess.title || "Chat Session"}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {new Date(sess.createdAt).toLocaleDateString()} • {sess.messages.length} messages
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => onDeleteSession(sess.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {currentMessages.length} message{currentMessages.length === 1 ? "" : "s"} in active transcript
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
