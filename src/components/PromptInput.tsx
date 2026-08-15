import React, { useState, useRef } from "react";
import { ModeType, Attachment } from "../types";
import { Send, Sparkles, MessageSquare, Type, X, Paperclip, BarChart2, Zap } from "lucide-react";

interface PromptInputProps {
  onSendMessage: (text: string, mode: ModeType, attachments: Attachment[]) => void;
  isLoading: boolean;
  activeMode: ModeType;
  onModeChange: (mode: ModeType) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSendMessage,
  isLoading,
  activeMode,
  onModeChange,
}) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!text.trim() && attachments.length === 0) || isLoading) return;

    onSendMessage(text, activeMode, attachments);
    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          url: result,
          base64Data: result.split(",")[1],
          mimeType: file.type,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div id="echo-prompt-input-container" className="space-y-3">
      {/* Mode Selector Chips */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        {[
          { id: "general", label: "General Q&A", emoji: "💬", icon: MessageSquare },
          { id: "copywriting", label: "Copywriting", emoji: "✍️", icon: Type },
          { id: "analysis", label: "Analysis & Insights", emoji: "📊", icon: BarChart2 },
          { id: "creative", label: "Creative Ideas", emoji: "🚀", icon: Zap },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id as ModeType)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeMode === m.id
                ? "bg-indigo-600/30 border-indigo-500/80 text-white shadow-md shadow-indigo-500/10"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-slate-900 border border-slate-800 focus-within:border-indigo-500/80 rounded-2xl p-3 sm:p-4 shadow-xl transition-all space-y-3"
      >
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="relative group bg-slate-950 rounded-xl p-1.5 border border-slate-800 flex items-center gap-2 max-w-[180px]"
              >
                {att.type.startsWith("image/") ? (
                  <img src={att.url} alt={att.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                    <Paperclip className="w-4 h-4" />
                  </div>
                )}
                <span className="text-xs text-slate-300 truncate flex-1">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            activeMode === "copywriting"
              ? "Ask Echo for headlines, email copy, slogans, or campaign messaging..."
              : activeMode === "analysis"
              ? "Ask Echo to analyze a topic, compare options, or break down complex concepts..."
              : activeMode === "creative"
              ? "Ask Echo for creative story ideas, brain-storming, or original concepts..."
              : "Ask Echo anything..."
          }
          rows={2}
          className="w-full bg-transparent text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
        />

        {/* Input Bar Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
              title="Attach Image or Reference File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Press Enter to send (Shift+Enter for newline)
            </span>
          </div>

          <button
            id="echo-submit-prompt-btn"
            type="submit"
            disabled={(!text.trim() && attachments.length === 0) || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Echo is typing...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
