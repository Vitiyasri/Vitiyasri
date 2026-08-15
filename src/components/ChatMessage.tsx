import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessageData } from "../types";
import { Sparkles, User, Copy, Check, RefreshCw, FileText } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageData;
  onRegenerate?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`group flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-colors ${
        isUser
          ? "bg-slate-900/40 border border-slate-800/60 ml-auto max-w-3xl"
          : "bg-slate-900/80 border border-slate-800 shadow-md max-w-4xl"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header Name & Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              {isUser ? "You" : "Echo AI"}
            </span>
            {!isUser && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Assistant ⚡
              </span>
            )}
            <span className="text-[10px] text-slate-500">
              {typeof message.timestamp === "string"
                ? message.timestamp
                : new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80"
              }`}
              title="Copy Message Text"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Regenerate Response"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* User Attachments Preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 pb-2">
            {message.attachments.map((att) => (
              <div key={att.id} className="relative rounded-lg overflow-hidden border border-slate-700 max-w-[160px]">
                {att.type.startsWith("image/") ? (
                  <img src={att.url} alt={att.name} referrerPolicy="no-referrer" className="h-20 w-auto object-cover" />
                ) : (
                  <div className="p-2 bg-slate-800 text-xs text-slate-300 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">{att.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Content */}
        <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
