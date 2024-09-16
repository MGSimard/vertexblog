import { MaximizeButton } from "@/components/MaximizeButton";

export function Notepad() {
  return (
    <div className="window outset notepad" data-draggable="true">
      <div className="window-header noselect" data-dragcontrol="true">
        <span>Post Title - Notepa - I think I want this to be a modal not a route</span>
        <div className="window-header-buttons">
          <MaximizeButton />
          <button type="button" className="outset">
            X
          </button>
        </div>
      </div>
      <div className="window-options noselect">
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">Search</button>
        <button type="button">Help</button>
      </div>
      <div className="window-content inset">
        <textarea className="notepad-textarea" spellCheck="false" />
      </div>
    </div>
  );
}
