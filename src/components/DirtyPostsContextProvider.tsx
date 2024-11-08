"use client";
import { createContext, useState, useContext, useEffect, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { dialogManager } from "@/lib/DialogManager";

type DirtyPosts = number[];
interface IsDirtyTypes {
  setDirtyPosts: Dispatch<SetStateAction<DirtyPosts>>;
}

const DirtyPostsContext = createContext<IsDirtyTypes | undefined>(undefined);

export function DirtyPostsContextProvider({ children }: { children: React.ReactNode }) {
  const [dirtyPosts, setDirtyPosts] = useState<DirtyPosts>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   console.log("PROVIDER MOUNTED");
  //   if (dirtyPosts.length) {
  //     window.history.pushState(null, "", window.location.href);
  //   } else {
  //     window.history.replaceState(null, "", window.location.href);
  //   }

  //   const handlePopState = (e: PopStateEvent) => {
  //     console.log("HANDLEPOPSTATE TRIGGERED.");
  //     if (dirtyPosts.length > 0 && !dialogOpen) {
  //       setDialogOpen(true);
  //       dialogManager.showDialog({
  //         type: "Warning",
  //         title: "Notepad",
  //         // TODO: Come up with more interesting text for this
  //         message: (
  //           <p>
  //             Some files have unsaved changes.
  //             <br />
  //             <br />
  //             Are you sure you want to leave this blog?
  //           </p>
  //         ),
  //         buttons: [
  //           {
  //             label: "Leave",
  //             func: () => router.back(),
  //           },
  //           { label: "Cancel" },
  //         ],
  //       });
  //     }
  //   };

  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     console.log("PROVIDER UNMOUNTED");
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [dirtyPosts, dialogOpen]);

  useEffect(() => {
    const handleNavigate = (link: string) => {
      if (!dirtyPosts.length) {
        router.push(link);
      } else {
        dialogManager.showDialog({
          type: "Warning",
          title: "Notepad",
          // TODO: Come up with more interesting text for this
          message: (
            <p>
              You have unsaved files.
              <br />
              <br />
              Are you sure you want to leave this blog?
            </p>
          ),
          buttons: [
            {
              label: "Leave",
              func: () => router.push(link),
            },
            { label: "Cancel" },
          ],
        });
      }
    };

    // Beforeunload doesn't handle internal SPA navigation, need this.
    const interceptLinkClicks = (e: MouseEvent) => {
      const link = (e.target as HTMLAnchorElement).closest("a");
      if (link && link.target !== "_blank") {
        e.preventDefault();
        handleNavigate(link.href);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyPosts.length) return;
      event.preventDefault();
      event.returnValue = true; // Legacy
    };

    document.addEventListener("click", interceptLinkClicks, true);
    // MDN RECOMMENDATION FOR FIREFOX PERFORMANCE - DON'T ADD LISTENER IF NOT UNSAVED
    if (dirtyPosts.length) window.addEventListener("beforeunload", handleBeforeUnload);
    else window.removeEventListener("beforeunload", handleBeforeUnload); // Silent if doesn't exist
    return () => {
      document.removeEventListener("click", interceptLinkClicks, true);
      window.removeEventListener("beforeunload", handleBeforeUnload); // Silent if doesn't exist
    };
  }, [dirtyPosts]);

  return <DirtyPostsContext.Provider value={{ setDirtyPosts }}>{children}</DirtyPostsContext.Provider>;
}

export function useDirtyPosts() {
  const context = useContext(DirtyPostsContext);
  if (!context) {
    throw new Error("The DirtyPosts context must be utilized within the DirtyPostsContext Provider.");
  }
  return context;
}
