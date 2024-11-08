"use client";
import { createContext, useState, useContext, useEffect, type Dispatch, type SetStateAction } from "react";

type DirtyPosts = { id: number; title: string }[];
interface IsDirtyTypes {
  dirtyPosts: DirtyPosts;
  setDirtyPosts: Dispatch<SetStateAction<DirtyPosts>>;
}

const DirtyPostsContext = createContext<IsDirtyTypes | undefined>(undefined);

export function DirtyPostsContextProvider({ children }: { children: React.ReactNode }) {
  const [dirtyPosts, setDirtyPosts] = useState<DirtyPosts>([]);

  useEffect(() => {
    console.log("DIRTYPOSTS CHANGED:", dirtyPosts);
  }, [dirtyPosts]);

  return <DirtyPostsContext.Provider value={{ dirtyPosts, setDirtyPosts }}>{children}</DirtyPostsContext.Provider>;
}

export function useDirtyPosts() {
  const context = useContext(DirtyPostsContext);
  if (!context) {
    throw new Error("The DirtyPosts context must be utilized within the DirtyPostsContext Provider.");
  }
  return context;
}
