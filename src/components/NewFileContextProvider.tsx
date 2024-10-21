"use client";
import { createContext, useState, useContext, type Dispatch, type SetStateAction } from "react";

interface NewFileTypes {
  isCreatingBlog: boolean;
  setIsCreatingBlog: Dispatch<SetStateAction<boolean>>;
  isCreatingPost: boolean;
  setIsCreatingPost: Dispatch<SetStateAction<boolean>>;
}

const NewFileContext = createContext<NewFileTypes | undefined>(undefined);

export function NewFileContextProvider({ children }: { children: React.ReactNode }) {
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  return (
    <NewFileContext.Provider value={{ isCreatingBlog, setIsCreatingBlog, isCreatingPost, setIsCreatingPost }}>
      {children}
    </NewFileContext.Provider>
  );
}

export function useNewFile() {
  const context = useContext(NewFileContext);
  if (!context) {
    throw new Error("The NewFile context must be utilized within the NewFileContext Provider.");
  }
  return context;
}
