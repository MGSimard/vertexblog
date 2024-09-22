"use client";
import { useSort } from "@/components/SortContextProvider";

export function FeSortButton() {
  const { blogSortType, setBlogSortType } = useSort();

  const handleBlogSort = (arg: string) => {
    setBlogSortType(arg);
  };

  return (
    <>
      <button type="button" onClick={() => handleBlogSort("name")}>
        Sort by Name Test
      </button>
      <button type="button" onClick={() => handleBlogSort("created")}>
        Sort by Created Test
      </button>
      <button type="button" onClick={() => handleBlogSort("updated")}>
        Sort by Updated Test
      </button>
    </>
  );
}
