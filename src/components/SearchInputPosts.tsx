"use client";

import { ChangeEvent, useEffect } from "react";
import { useSearch } from "@/components/SearchContextProvider";

export function SearchInputPosts() {
  const { postSearch, setPostSearch } = useSearch();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setPostSearch(e.target.value);
  };

  useEffect(() => {
    return () => setPostSearch("");
  }, []);

  return (
    <div className="window-search">
      <span>Search</span>
      <input type="search" placeholder="Search Posts..." value={postSearch} onChange={handleSearch} />
    </div>
  );
}
