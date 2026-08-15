import React, { useState, useEffect, useRef } from "react";
import { ChatMessageData, ModeType, Attachment, ChatSession } from "./types";
import { Header } from "./components/Header";
import { ChatMessage } from "./components/ChatMessage";
import { PromptInput } from "./components/PromptInput";
import { StarterPrompts } from "./components/StarterPrompts";
import { SystemPromptModal } from "./components/SystemPromptModal";
import { TranscriptModal } from "./components/TranscriptModal";

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem("echo_ai_chat_sessions");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load chat sessions:", e);
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("echo_ai_current_session_id") || null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    try {
      const saved = localStorage.getItem("echo_ai_chat_messages");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
    return [];
  });

  const [activeMode, setActiveMode] = useState<ModeType>("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save current messages & update active session in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("echo_ai_chat_messages", JSON.stringify(messages));

      if (messages.length > 0) {
        let sessId = currentSessionId;
        if (!sessId) {
          sessId = "session_" + Math.random().toString(36).substr(2, 9);
          setCurrentSessionId(sessId);
          localStorage.setItem("echo_ai_current_session_id", sessId);
        }

        const firstUserMsg = messages.find((m) => m.role === "user")?.content || "Chat Session";
        const title = firstUserMsg.slice(0, 35) + (firstUserMsg.length > 35 ? "..." : "");

        setSessions((prev) => {
          const existingIdx = prev.findIndex((s) => s.id === sessId);
          const now = new Date().toISOString();
          let updated: ChatSession[];

          if (existingIdx >= 0) {
            updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              title,
              updatedAt: now,
              messages,
            };
          } else {
            const newSess: ChatSession = {
              id: sessId!,
              title,
              createdAt: now,
              updatedAt: now,
              messages,
            };
            updated = [newSess, ...prev];
          }

          localStorage.setItem("echo_ai_chat_sessions", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  }, [messages, currentSessionId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clear Chat / Start New Chat instantly
  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    localStorage.removeItem("echo_ai_chat_messages");
    localStorage.removeItem("echo_ai_current_session_id");
  };

  // Select a past chat session from history transcript
  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    localStorage.setItem("echo_ai_current_session_id", session.id);
    localStorage.setItem("echo_ai_chat_messages", JSON.stringify(session.messages));
  };

  // Delete a session from history
  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      localStorage.setItem("echo_ai_chat_sessions", JSON.stringify(filtered));
      return filtered;
    });

    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  // Send message to server
  const handleSendMessage = async (text: string, mode: ModeType, attachments: Attachment[] = []) => {
    if (!text.trim() && attachments.length === 0) return;

    const userMsgId = Math.random().toString(36).substr(2, 9);
    const userMessage: ChatMessageData = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
      mode,
      attachments,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          mode,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const assistantText = data.text || "I'm sorry, I couldn't generate a response.";

      const assistantMsgId = Math.random().toString(36).substr(2, 9);
      const assistantMessage: ChatMessageData = {
        id: assistantMsgId,
        role: "assistant",
        content: assistantText,
        timestamp: new Date().toISOString(),
        mode,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Send message error:", error);
      const errorMsg: ChatMessageData = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: `⚠️ **Error communicating with Echo AI:** ${error.message || "Something went wrong."}\n\nPlease check your server or API configuration and try again.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="echo-app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onNewChat={handleNewChat}
        onOpenSystemPrompt={() => setIsSystemPromptOpen(true)}
        onOpenTranscript={() => setIsTranscriptOpen(true)}
        messageCount={messages.length}
      />

      {/* Main Chat Workspace Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col justify-between space-y-4">
        {messages.length === 0 ? (
          <StarterPrompts
            onSelectPrompt={(prompt, mode) => {
              setActiveMode(mode);
              handleSendMessage(prompt, mode);
            }}
          />
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={
                  msg.role === "assistant"
                    ? () => {
                        const userMsgs = messages.filter((m) => m.role === "user");
                        if (userMsgs.length > 0) {
                          const lastUser = userMsgs[userMsgs.length - 1];
                          handleSendMessage(lastUser.content, lastUser.mode || "general");
                        }
                      }
                    : undefined
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Fixed or Sticky Prompt Bar */}
        <div className="sticky bottom-3 z-20 pt-2 bg-slate-950/80 backdrop-blur-md">
          <PromptInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeMode={activeMode}
            onModeChange={(mode) => setActiveMode(mode)}
          />
        </div>
      </main>

      {/* System Prompt Guidelines Modal */}
      <SystemPromptModal
        isOpen={isSystemPromptOpen}
        onClose={() => setIsSystemPromptOpen(false)}
      />

      {/* Transcript & Chat History Modal */}
      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        currentMessages={messages}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
}
