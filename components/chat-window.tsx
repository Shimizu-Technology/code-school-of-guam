"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm the Code School of Guam assistant. I can answer questions about our coding bootcamp, curriculum, pricing, admissions, and more. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
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
          history: messages.slice(-6), // Send last 6 messages for context
          // change this to send full history, not just the last 6 messages
        }),
      });

      const data = await response.json();

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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-ruby-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">CSG Assistant</h3>
            <p className="text-xs text-ruby-100">Ask me anything!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-ruby-700 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-gray-600 text-white"
                  : "bg-ruby-100 text-ruby-600"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 ${
                message.role === "user"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ruby-100 text-ruby-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-ruby-600" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-ruby-500 focus:outline-none focus:ring-1 focus:ring-ruby-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-ruby-600 text-white transition-colors hover:bg-ruby-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Powered by AI • Answers based on CSG information
        </p>
      </div>
    </div>
  );
}

