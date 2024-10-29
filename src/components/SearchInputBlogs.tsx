"use client";

import type { ChangeEvent } from "react";
import { useSearch } from "@/components/SearchContextProvider";

export function SearchInputBlogs() {
  const { blogSearch, setBlogSearch } = useSearch();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setBlogSearch(e.target.value);
  };

  return (
    <div className="window-search">
      <span>Search</span>
      <input type="search" placeholder="Search Blogs..." value={blogSearch} onChange={handleSearch} />
    </div>
  );
}
