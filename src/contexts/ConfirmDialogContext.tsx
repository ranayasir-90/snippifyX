"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

type ConfirmDialogContextType = {
  showConfirm: (options: {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => void;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  return context;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => () => {});
  const [confirmText, setConfirmText] = useState("Yes");
  const [cancelText, setCancelText] = useState("No");

  const showConfirm = ({ message, onConfirm, onCancel, confirmText, cancelText }: {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => {
    setMessage(message);
    setOnConfirm(() => () => {
      setOpen(false);
      onConfirm();
    });
    setOnCancel(() => () => {
      setOpen(false);
      if (onCancel) onCancel();
    });
    setConfirmText(confirmText || "Yes");
    setCancelText(cancelText || "No");
    setOpen(true);
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Confirm Action</h2>
            <p className="mb-8 text-gray-700 text-lg leading-relaxed">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors duration-200 flex-1 sm:flex-none"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
              <button
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors duration-200 flex-1 sm:flex-none"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
} 