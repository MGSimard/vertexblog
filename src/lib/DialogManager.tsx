import { createRoot } from "react-dom/client";
import { DialogWindow } from "@/components/DialogWindow";
import type { DialogOptionsTypes } from "@/types/types";

// First time using LLM-generated code, let's see what Claude's got
// update: damn claude got hands

class DialogManager {
  dialogContainer: HTMLElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.dialogContainer = document.createElement("div");
      document.body.appendChild(this.dialogContainer);
    }
  }

  showDialog(options: DialogOptionsTypes) {
    const dialogId = `dialog-${Date.now()}`;
    const dialogElement = document.createElement("div");
    dialogElement.id = dialogId;
    this.dialogContainer?.appendChild(dialogElement);

    const root = createRoot(dialogElement);

    const closeDialog = () => {
      root.unmount();
      dialogElement.remove();
    };

    root.render(
      <DialogWindow
        {...options}
        closeDialog={closeDialog}
        buttons={options.buttons.map((btn) => ({
          ...btn,
          func: () => {
            const result = btn.func?.();
            if (result instanceof Promise) {
              void result.then(() => closeDialog());
            } else {
              closeDialog();
            }
          },
        }))}
      />
    );

    return closeDialog;
  }
}

export const dialogManager = new DialogManager();
