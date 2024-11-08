"use client";
import { createContext, useState, useContext, type Dispatch, type SetStateAction } from "react";

type DirtyPosts = { id: number; title: string }[];
interface IsDirtyTypes {
  dirtyPosts: DirtyPosts;
  setDirtyPosts: Dispatch<SetStateAction<DirtyPosts>>;
}

const DirtyPostsContext = createContext<IsDirtyTypes | undefined>(undefined);

export function DirtyPostsContextProvider({ children }: { children: React.ReactNode }) {
  // 1. On Notepad isDirty change, update this context array
  // 2. After update, if array is empty and we're trying a navigation, do navigation
  // 3. Otherwise, do nothing.
  // 4. Still allow singular notepad closure attempts, so keep that logic localized to each notepad.
  const [dirtyPosts, setDirtyPosts] = useState<DirtyPosts>([]);

  return <DirtyPostsContext.Provider value={{ dirtyPosts, setDirtyPosts }}>{children}</DirtyPostsContext.Provider>;
}

export function useDirtyPosts() {
  const context = useContext(DirtyPostsContext);
  if (!context) {
    throw new Error("The DirtyPosts context must be utilized within the DirtyPostsContext Provider.");
  }
  return context;
}
