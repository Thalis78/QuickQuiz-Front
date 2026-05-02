"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ToastProps = {
  message: string | null;
  variant?: "success" | "error";
  duration?: number;
  onClose: () => void;
};

export const Toast = ({
  message,
  variant = "success",
  duration = 3000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const variants = {
    success: "bg-emerald-600 shadow-emerald-500/20 border-emerald-400/20",
    error: "bg-red-600 shadow-red-500/20 border-red-400/20",
  };

  return (
    <div className="fixed top-20 inset-x-0 z-[10002] flex justify-center px-4 pointer-events-none">
      <div
        className={`
          ${variants[variant]}
          pointer-events-auto
          flex items-start justify-between gap-4
          px-6 py-3.5 rounded-2xl
          text-white border
          shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          animate-in fade-in slide-in-from-top-4
          duration-300
          w-full sm:max-w-md
        `}
      >
        <span className="flex-1 text-[11px] font-bold uppercase tracking-widest leading-normal break-words">
          {message}
        </span>

        <button
          onClick={onClose}
          className="p-1 -mr-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 mt-0.5"
        >
          <X size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
