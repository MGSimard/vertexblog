import Link from "next/link";
import { MaximizeButton } from "@/components/MaximizeButton";
import { CloseIcon } from "@/components/icons";
import { CurrentFolder } from "@/components/CurrentFolder";

// THIS IS THE LAYOUT FOR RECURRING FILE EXPLORER WINDOW, WE RENDER THE CURRENT FOLDER WE'RE IN WITHIN THAT LAYOUT (WINDOW)

export default function FileExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="window outset"
        data-draggable="true"
        style={{ left: "20vw", width: "60vw", top: "20vh", height: "60vh" }}>
        <div className="window-header" data-dragcontrol="true">
          <span className="window-header-left">
            <img src="/assets/FolderOpen.svg" alt="" />
            <CurrentFolder />
          </span>
          <div className="window-header-buttons">
            <MaximizeButton />
            <Link href="/" className="link-as-button outset" aria-label="Close">
              <CloseIcon />
            </Link>
          </div>
        </div>
        {children}
        <div className="window-footer">
          <span>Description of current action.</span>
        </div>
      </div>
    </>
  );
}
