"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, X, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    "Hi! I'm the Code School of Guam assistant. I can answer questions about our focused courses, full bootcamp, availability, and learning paths. How can I help you today?",
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
  const dialogRef = useRef<HTMLDivElement>(null);

  // Persist messages to sessionStorage on change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
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
            "The assistant could not answer right now. Please try again or email codeschoolofguam@gmail.com for help.",
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
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="csg-chat-title"
      className={`csg-chat-window fixed left-4 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ${
        isExpanded
          ? "sm:left-auto sm:h-[600px] sm:w-[600px]"
          : "sm:left-auto sm:h-[500px] sm:w-[400px]"
      } sm:max-h-[calc(100dvh-6rem)]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-ruby-600 py-1.5 pl-4 pr-1.5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 id="csg-chat-title" className="text-sm font-semibold leading-tight">CSG Assistant</h3>
            <p className="text-xs text-ruby-100">Ask me anything!</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="csg-press hidden h-11 w-11 items-center justify-center rounded-full hover:bg-ruby-700 active:bg-ruby-800 sm:flex"
            aria-label={isExpanded ? "Shrink chat" : "Expand chat"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            onClick={onClose}
            className="csg-press flex h-11 w-11 items-center justify-center rounded-full hover:bg-ruby-700 active:bg-ruby-800"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-busy={isLoading}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-slate-700 text-white"
                  : "bg-ruby-100 text-ruby-600"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Message bubble: min-w-0 lets it shrink; long words wrap and code/tables scroll inside. */}
            <div
              className={`min-w-0 [overflow-wrap:anywhere] ${
                isExpanded ? "max-w-[85%]" : "max-w-[80%]"
              } ${
                message.role === "user"
                  ? "rounded-2xl rounded-tr-md bg-slate-700 px-3.5 py-2.5 text-white"
                  : "rounded-2xl rounded-tl-md bg-slate-50 px-3.5 py-2.5 text-slate-800 border border-slate-100"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="chat-markdown text-[13px] leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ruby-600 underline underline-offset-2 hover:text-ruby-700 break-words"
                        >
                          {children}
                        </a>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-slate-900">{children}</strong>
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
                        <code className="rounded bg-slate-200 px-1 py-0.5 text-xs font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="my-2 max-w-full overflow-x-auto rounded-lg bg-slate-800 p-3 text-xs leading-relaxed text-slate-100 [overflow-wrap:normal] [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
                          {children}
                        </pre>
                      ),
                      table: ({ children }) => (
                        <div className="my-2 max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
                          <table className="w-full border-collapse text-left text-xs [overflow-wrap:normal]">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border-b border-slate-200 bg-slate-100 px-2.5 py-1.5 font-semibold text-slate-900">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border-t border-slate-100 px-2.5 py-1.5 align-top">
                          {children}
                        </td>
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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ruby-100 text-ruby-600">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-slate-50 border border-slate-100 px-3.5 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-ruby-600" />
              <span className="text-[13px] text-slate-500">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            aria-label="Message the Code School assistant"
            disabled={isLoading}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base placeholder:text-slate-500 focus:border-ruby-500 focus:outline-none focus:ring-1 focus:ring-ruby-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="csg-press flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ruby-600 text-white hover:bg-ruby-700 active:bg-ruby-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-600">
          Powered by AI &middot; Answers based on CSG information
        </p>
      </div>
    </div>
  );
}
