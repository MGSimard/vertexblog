import Link from "next/link";
import { CurrentPath } from "@/components/CurrentPath";

// THIS IS THE LAYOUT FOR RECURRING FILE EXPLORER WINDOW, WE RENDER THE CURRENT FOLDER WE'RE IN WITHIN THAT LAYOUT (WINDOW)

export default function FileExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="file-explorer outset">
      <div className="fe-header noselect">
        <span>Current Location</span>
        <Link href="/" className="link-as-button outset">
          X
        </Link>
      </div>
      <label className="fe-address">
        <span>Address</span>
        <CurrentPath />
      </label>
      {children}
      <div className="fe-footer noselect">
        <span>Description of current action.</span>
      </div>
    </div>
  );
}
