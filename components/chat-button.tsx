"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./chat-window";

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Stop the pulse animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* Chat Toggle Button - Fixed in bottom-right corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isOpen
            ? "bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-500"
            : "bg-ruby-600 text-white hover:bg-ruby-700 focus:ring-ruby-500"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Pulse animation when closed — fades out after a few seconds */}
      {!isOpen && showPulse && (
        <span aria-hidden="true" className="fixed bottom-4 right-4 z-40 flex h-14 w-14 pointer-events-none">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ruby-400 opacity-75"></span>
        </span>
      )}
    </>
  );
}
