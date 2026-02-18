"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, X, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const STORAGE_KEY = "csg-chat-messages";
const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm the Code School of Guam assistant. I can answer questions about our coding bootcamp, curriculum, pricing, admissions, and more. How can I help you today?",
};

function loadMessages(): Message[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // sessionStorage unavailable or corrupt — fall through
  }
  return [INITIAL_MESSAGE];
}

function saveMessages(messages: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // quota exceeded or unavailable — silently ignore
  }
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist messages to sessionStorage on change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        throw new Error("No response received");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error. Please try again or contact codeschoolofguam@gmail.com for assistance.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-out ${
        isExpanded
          ? "sm:left-auto sm:h-[600px] sm:w-[600px]"
          : "sm:left-auto sm:h-[500px] sm:w-[400px]"
      } h-[500px]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-ruby-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">CSG Assistant</h3>
            <p className="text-[11px] text-ruby-100">Ask me anything!</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden rounded-full p-1.5 hover:bg-ruby-700 transition-colors sm:flex items-center justify-center"
            aria-label={isExpanded ? "Shrink chat" : "Expand chat"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-ruby-700 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-gray-700 text-white"
                  : "bg-ruby-100 text-ruby-600"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`overflow-hidden ${
                isExpanded ? "max-w-[85%]" : "max-w-[80%]"
              } ${
                message.role === "user"
                  ? "rounded-2xl rounded-tr-md bg-gray-700 px-3.5 py-2.5 text-white"
                  : "rounded-2xl rounded-tl-md bg-gray-50 px-3.5 py-2.5 text-gray-800 border border-gray-100"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="chat-markdown text-[13px] leading-relaxed">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ruby-600 underline underline-offset-2 hover:text-ruby-700 break-all"
                        >
                          {children}
                        </a>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 ml-4 list-disc space-y-0.5 last:mb-0">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 ml-4 list-decimal space-y-0.5 last:mb-0">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      code: ({ children }) => (
                        <code className="rounded bg-gray-200 px-1 py-0.5 text-xs font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-[13px] whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ruby-100 text-ruby-600">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-gray-50 border border-gray-100 px-3.5 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-ruby-600" />
              <span className="text-[13px] text-gray-500">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-gray-50/50 p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-ruby-500 focus:outline-none focus:ring-1 focus:ring-ruby-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-ruby-600 text-white transition-all duration-200 hover:bg-ruby-700 hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-400">
          Powered by AI &middot; Answers based on CSG information
        </p>
      </div>
    </div>
  );
}
