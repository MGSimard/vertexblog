"use client";
import { createContext, useState, useContext, useEffect, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { dialogManager } from "@/lib/DialogManager";

type DirtyPosts = number[];
interface IsDirtyTypes {
  dirtyPosts: DirtyPosts;
  setDirtyPosts: Dispatch<SetStateAction<DirtyPosts>>;
}

const DirtyPostsContext = createContext<IsDirtyTypes | undefined>(undefined);

export function DirtyPostsContextProvider({ children }: { children: React.ReactNode }) {
  const [dirtyPosts, setDirtyPosts] = useState<DirtyPosts>([]);
  const router = useRouter();

  const handleNavigate = (link: string) => {
    console.log("HANDLENAVIGATE TRIGGERED:", link);
  };

  const handlePopState = (event: PopStateEvent) => {
    console.log("HANDLEPOPSTATE TRIGGERED.");
    if (!dirtyPosts.length) return;
    event.preventDefault();
    window.history.pushState(null, "", window.location.href);
  };

  // Beforeunload doesn't handle internal SPA navigation, need this.
  const interceptLinkClicks = (e: MouseEvent) => {
    console.log("INTERCEPTLINKCLICKS TRIGGERED.");
    const link = (e.target as HTMLAnchorElement).closest("a");

    if (link && link.target !== "_blank") {
      e.preventDefault();
      // TODO: Rework this to only push to documents if no other notepad is dirty
      // So basically just make a function that checks dirtypostscontext for length
      // And only push on length detected, otherwise run onClose()

      handleNavigate(link.href);
    }
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log("HANDLEBEFOREUNLOAD TRIGGERED.");
    if (!dirtyPosts.length) return;
    event.preventDefault();
    event.returnValue = "";
  };

  useEffect(() => {
    // TODO: POPSTATE STUFF, window history stuff.
    // Console log some history stacks to figure out how to avoid writing duplicated history entries so that back works
    console.log("DIRTYPOSTS CHANGED:", dirtyPosts);
    document.addEventListener("click", interceptLinkClicks, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("click", interceptLinkClicks, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
