'use client';
import React, { createContext, useContext, useState, useCallback } from "react";
import { snippetService, Snippet, folderService, Folder, User } from "@/lib/firebaseServices";
import SnippetDetailModal from "@/components/SnippetDetailModal";
import { useAuth } from "@/contexts/AuthContext";

interface SnippetModalContextType {
  openSnippet: (snippetId: string) => void;
}

const SnippetModalContext = createContext<SnippetModalContextType>({
  openSnippet: () => {},
});

export const SnippetModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const { user } = useAuth();

  const openSnippet = useCallback(async (snippetId: string) => {
    const snip = await snippetService.getById(snippetId);
    if (snip) {
      setSnippet(snip);
      // Optionally load folders for the user (for modal props)
      if (user?.id) {
        const userFolders = await folderService.getByUser(user.id);
        setFolders(userFolders);
      } else {
        setFolders([]);
      }
      setOpen(true);
    }
  }, [user]);

  const close = () => {
    setOpen(false);
    setSnippet(null);
  };

  return (
    <SnippetModalContext.Provider value={{ openSnippet }}>
      {children}
      <SnippetDetailModal
        open={open}
        onClose={close}
        snippet={snippet}
        folders={folders}
        user={user}
        showEditDelete={!!user && snippet?.userId === user?.id}
        showLikeButton={true}
        showFolder={true}
        showFavorite={true}
      />
    </SnippetModalContext.Provider>
  );
};

export function useSnippetModal() {
  return useContext(SnippetModalContext);
} 