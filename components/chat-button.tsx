"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("./chat-window").then((module) => module.ChatWindow), { ssr: false });

const CHAT_VISIBILITY_SCROLL_Y = 520;

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);
  const preserveLauncherRef = useRef(false);

  const closeChat = () => {
    // Protect the launcher from momentum-scroll updates until focus returns.
    preserveLauncherRef.current = true;
    setIsVisible(true);
    setIsOpen(false);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
      return;
    }

    hasOpenedRef.current = true;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen && hasOpenedRef.current) {
      launcherRef.current?.focus();
      preserveLauncherRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const launcherIsFocused = launcherRef.current === document.activeElement;
      setIsVisible(
        window.scrollY > CHAT_VISIBILITY_SCROLL_Y ||
        preserveLauncherRef.current ||
        launcherIsFocused,
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shown = isVisible || isOpen;

  return (
    <>
      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={closeChat} />}

      {/*
        Compact, safe-area-aware help control. It stays mounted and fades/scales in
        (instead of popping) once the reader scrolls; while hidden it is invisible,
        so it is neither focusable nor clickable.
      */}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggleChat}
        onBlur={() => {
          preserveLauncherRef.current = false;
          if (!isOpen && window.scrollY <= CHAT_VISIBILITY_SCROLL_Y) setIsVisible(false);
        }}
        data-visible={shown ? "true" : "false"}
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 shadow-lg transition-[opacity,scale,translate,background-color,visibility] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 md:h-14 md:w-14 ${
          shown ? "visible scale-100 opacity-100 active:scale-[0.97]" : "pointer-events-none invisible scale-95 opacity-0"
        } ${
          isOpen
            ? "bg-slate-700 text-white hover:bg-slate-800"
            : "bg-ruby-600 text-white hover:bg-ruby-700"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
