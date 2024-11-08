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
  const [blogSearch, setBlogSearch] = useState("");
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
