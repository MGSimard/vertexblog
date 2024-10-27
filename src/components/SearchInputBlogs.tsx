"use client";

import { ChangeEvent } from "react";
import { useSearch } from "./SearchContextProvider";

export function SearchInputBlogs() {
  const { blogSearch, setBlogSearch } = useSearch();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setBlogSearch(e.target.value);
  };

  return (
    <div>
      <span>Search</span>
      <input
        type="search"
        placeholder="Placeholder filter field..."
        defaultValue={blogSearch}
        onChange={handleSearch}
      />
    </div>
  );
}
