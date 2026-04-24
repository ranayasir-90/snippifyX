"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ErrorContextType = {
  showError: (message: string) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useError must be used within ErrorProvider");
  return context;
}

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => setError(message);
  const handleClose = () => setError(null);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
            <p className="mb-6 text-gray-700">{error}</p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
} 