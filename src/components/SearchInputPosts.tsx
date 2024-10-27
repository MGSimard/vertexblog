"use client";

import { ChangeEvent, useEffect } from "react";
import { useSearch } from "./SearchContextProvider";

export function SearchInputPosts() {
  const { postSearch, setPostSearch } = useSearch();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setPostSearch(e.target.value);
  };

  useEffect(() => {
    return () => setPostSearch("");
  }, []);

  return (
    <div>
      <span>Search</span>
      <input type="search" placeholder="Placeholder filter field..." value={postSearch} onChange={handleSearch} />
    </div>
  );
}
