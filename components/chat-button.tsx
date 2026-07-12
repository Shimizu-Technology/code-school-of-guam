"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./chat-window";

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Stop the pulse animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 520);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* Compact, safe-area-aware help control */}
      {isVisible && <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 md:h-14 md:w-14 ${
          isOpen
            ? "bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500"
            : "bg-ruby-600 text-white hover:bg-ruby-700 focus:ring-ruby-500"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>}

      {/* Pulse animation when closed — fades out after a few seconds */}
      {isVisible && !isOpen && showPulse && (
        <span aria-hidden="true" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 hidden h-12 w-12 pointer-events-none md:flex md:h-14 md:w-14">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ruby-400 opacity-75"></span>
        </span>
      )}
    </>
  );
}
