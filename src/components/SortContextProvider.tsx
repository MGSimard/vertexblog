"use client";
import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

interface SortTypes {
  blogSortType: string;
  setBlogSortType: Dispatch<SetStateAction<string>>;
  postSortType: string;
  setPostSortType: Dispatch<SetStateAction<string>>;
}

const SortContext = createContext<SortTypes | undefined>(undefined);

export function SortContextProvider({ children }: { children: React.ReactNode }) {
  const [blogSortType, setBlogSortType] = useState("name");
  const [postSortType, setPostSortType] = useState("name");

  return (
    <SortContext.Provider value={{ blogSortType, setBlogSortType, postSortType, setPostSortType }}>
      {children}
    </SortContext.Provider>
  );
}

export function useSort() {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("The sorting context must be utilized within the SortContext Provider.");
  }
  return context;
}

// "use client";
// import { createContext, useRef, useContext } from "react";

// interface SortTypes {
//   blogSortType: any;
//   changeBlogSort: (sorter: string) => void;
//   postSortType: any;
//   changePostSort: (sorter: string) => void;
// }

// const SortContext = createContext<SortTypes | undefined>(undefined);

// export function SortContextProvider({ children }: { children: React.ReactNode }) {
//   const blogSortType = useRef("");
//   const changeBlogSort = (arg: string) => {
//     blogSortType.current = arg;
//   };

//   const postSortType = useRef("");
//   const changePostSort = (arg: string) => {
//     blogSortType.current = arg;
//   };

//   return (
//     <SortContext.Provider value={{ blogSortType, changeBlogSort, postSortType, changePostSort }}>
//       {children}
//     </SortContext.Provider>
//   );
// }

// export function useSort() {
//   const context = useContext(SortContext);
//   if (!context) {
//     throw new Error("The sorting context must be utilized within the SortContext Provider.");
//   }
//   return context;
// }
