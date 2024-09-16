import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";
import { MaximizeButton } from "@/components/MaximizeButton";
import { Notepad } from "@/components/Notepad";

// THIS IS THE LAYOUT FOR RECURRING FILE EXPLORER WINDOW, WE RENDER THE CURRENT FOLDER WE'RE IN WITHIN THAT LAYOUT (WINDOW)

export default function FileExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Notepad />
      <div className="window outset" data-draggable="true">
        <div className="window-header noselect o1" data-dragcontrol="true">
          <span>Current Location</span>
          <div className="window-header-buttons">
            <MaximizeButton />
            <Link href="/" className="link-as-button outset" aria-label="Close">
              X
            </Link>
          </div>
        </div>
        <label className="window-address o3">
          <span className="noselect">Address</span>
          <CurrentPath />
        </label>
        {children}
        <div className="window-footer noselect o5">
          <span>Description of current action.</span>
        </div>
      </div>
    </>
  );
}
