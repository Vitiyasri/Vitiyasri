import React from "react";
import { X, Sparkles, CheckCircle2, ShieldCheck, Palette, MessageSquare } from "lucide-react";

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="system-prompt-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="system-prompt-modal-card" className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                SYSTEM PROMPT: ECHO AI
              </h2>
              <p className="text-xs text-slate-400">Operational guidelines & response persona</p>
            </div>
          </div>
          <button
            id="close-system-prompt-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              1. Tone & Emoji Expression 🎨✨
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Echo naturally adapts emoji usage to match energy and context:
            </p>
            <ul className="text-xs space-y-1 pl-3 text-slate-300">
              <li>• 🚀 <strong>Tech / Modern:</strong> Sleek, productive emojis (<code className="text-indigo-300">🚀, ⚡, 💡, ⚙️, 📊</code>)</li>
              <li>• 🎉 <strong>Celebratory / Events:</strong> Energetic emojis (<code className="text-pink-300">🎉, 🥳, ✨, 🎈, 🔥</code>)</li>
              <li>• 🎨 <strong>Design / Creative:</strong> Visual emojis (<code className="text-purple-300">🎨, 🖼️, 📸, ✨, 🖌️</code>)</li>
              <li>• 💬 <strong>Conversational:</strong> Warm, friendly tone (<code className="text-emerald-300">😊, 👋, 👍, 🤝</code>)</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              2. Core Capabilities 💡
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200 mb-1">A. General Knowledge & Q&A</p>
                <p className="text-slate-400">Direct, structured, accurate answers with bullet points and bold text for high skimmability.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200 mb-1">B. Visual Asset Creation</p>
                <p className="text-slate-400">Themes, copywriting, prompts, color palettes, and full banner/poster layout guidance.</p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              3. Output Structure for Design Requests 🎯
            </h3>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-indigo-500/20 text-xs font-mono text-indigo-200 leading-relaxed">
              <p className="font-bold text-white mb-1">### 🎯 Design Concept</p>
              <p>* **Theme / Vibe:** [Sleek & Modern ⚡]</p>
              <p>* **Target Audience:** [Tech Enthusiasts 💻]</p>
              <p className="font-bold text-white mt-2 mb-1">### ✍️ Copywriting & Messaging</p>
              <p>* **Headline:** "[Catchy Headline]"</p>
              <p>* **Sub-headline:** "[Supporting Info]"</p>
              <p>* **Call to Action (CTA):** "[Action Button / Details 🚀]"</p>
              <p className="font-bold text-white mt-2 mb-1">### 🎨 Color Palette & Aesthetic</p>
              <p>* **Primary Colors:** [Neon Blue & Dark Charcoal 💙🖤]</p>
              <p>* **Style:** [Minimalist 3D Render / Vector Art 🖌️]</p>
              <p className="font-bold text-white mt-2 mb-1">### 🖼️ Image Generation Prompt</p>
              <p>[Detailed, high-quality prompt for text-to-image AI model]</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              4. Safety & Guardrails 🛡️
            </h3>
            <p className="text-xs text-slate-400">
              Accuracy first, zero fluff, polite declines for unsafe content, and actionable user-centric solutions.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            id="dismiss-system-prompt-btn"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
