"use client";
import { createContext, useState, useContext, type Dispatch, type SetStateAction } from "react";

interface SearchTypes {
  blogSearch: string;
  setBlogSearch: Dispatch<SetStateAction<string>>;
  postSearch: string;
  setPostSearch: Dispatch<SetStateAction<string>>;
}

const SearchContext = createContext<SearchTypes | undefined>(undefined);

export function SearchContextProvider({ children }: { children: React.ReactNode }) {
  // Set blog search default value to this
  // Don't clear on unmount documents page unmount - in windows when returning to folder search is still there.
  // Maybe clear on window layout unmount though?
  const [blogSearch, setBlogSearch] = useState("");
  // However, for POST search, we should clear on blog page unmount (set to empty string).
  const [postSearch, setPostSearch] = useState("");

  return (
    <SearchContext.Provider value={{ blogSearch, setBlogSearch, postSearch, setPostSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("The search context must be utilized within the SearchContext Provider.");
  }
  return context;
}
