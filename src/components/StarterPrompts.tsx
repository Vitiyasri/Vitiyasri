import React from "react";
import { ModeType } from "../types";
import { Sparkles, ArrowRight } from "lucide-react";

interface StarterPromptsProps {
  onSelectPrompt: (prompt: string, mode: ModeType) => void;
}

export const StarterPrompts: React.FC<StarterPromptsProps> = ({ onSelectPrompt }) => {
  const categories = [
    {
      title: "✍️ Copywriting & Messaging",
      mode: "copywriting" as ModeType,
      prompts: [
        "Draft compelling headlines and CTA copy for a developer tool launch ⚡",
        "Suggest catchy slogans and brand positioning copy for a startup ☕",
      ],
    },
    {
      title: "📊 Analysis & Insights",
      mode: "analysis" as ModeType,
      prompts: [
        "Explain key differences between SQL and NoSQL databases for high-scale apps 💡",
        "What are the top web application architectural trends in 2026? 📊",
      ],
    },
    {
      title: "🚀 Creative Brainstorming",
      mode: "creative" as ModeType,
      prompts: [
        "Generate 5 unique startup ideas leveraging real-time agentic AI models 🤖",
        "Write an engaging product pitch email for an AI coding platform 🚀",
      ],
    },
  ];

  return (
    <div id="echo-starter-prompts-container" className="py-6 space-y-6 max-w-3xl mx-auto">
      {/* Intro Hero Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Welcome to Echo AI Assistant</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          How can Echo help you today?
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Ask questions, get expert copywriting, request logical analysis, or brainstorm creative ideas with Echo AI.
        </p>
      </div>

      {/* Prompt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {categories.map((cat, catIdx) => (
          <div
            key={catIdx}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-indigo-500/30 transition-all"
          >
            <h3 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{cat.title}</span>
            </h3>

            <div className="space-y-2">
              {cat.prompts.map((p, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => onSelectPrompt(p, cat.mode)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2 pr-2">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
