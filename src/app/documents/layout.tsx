import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";

// THIS IS THE LAYOUT FOR RECURRING FILE EXPLORER WINDOW, WE RENDER THE CURRENT FOLDER WE'RE IN WITHIN THAT LAYOUT (WINDOW)

export default function FileExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="file-explorer outset" data-draggable="true">
      <div className="fe-header noselect" data-dragcontrol="true">
        <span>Current Location</span>
        <div>
          <button className="link-as-button outset" type="button" aria-label="Minimize">
            _
          </button>
          <button className="link-as-button outset" type="button" aria-label="Maximize">
            []
          </button>
          <Link href="/" className="link-as-button outset" aria-label="Close">
            X
          </Link>
        </div>
      </div>
      <label className="fe-address">
        <span className="noselect">Address</span>
        <CurrentPath />
      </label>
      {children}
      <div className="fe-footer noselect">
        <span>Description of current action.</span>
      </div>
    </div>
  );
}
