// PDF file saving utility for Tauri desktop app
import { isTauri } from "./tauri";

/**
 * Save a PDF blob to a file using native file dialog
 */
export async function savePdfToFile(
  pdfBlob: Blob,
  defaultFileName: string = "document.pdf"
): Promise<string | null> {
  if (!isTauri()) {
    // Browser fallback: trigger download
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return defaultFileName;
  }

  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile } = await import("@tauri-apps/plugin-fs");

    // Show native save dialog
    const filePath = await save({
      defaultPath: defaultFileName,
      filters: [
        {
          name: "PDF Documents",
          extensions: ["pdf"],
        },
      ],
    });

    if (!filePath) {
      return null; // User cancelled
    }

    // Convert blob to Uint8Array
    const buffer = await pdfBlob.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Write file
    await writeFile(filePath, uint8Array);

    return filePath;
  } catch (error) {
    console.error("Failed to save PDF:", error);
    throw error;
  }
}

/**
 * Open a folder selection dialog
 */
export async function selectFolder(): Promise<string | null> {
  if (!isTauri()) {
    return null;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const result = await open({
      directory: true,
      multiple: false,
    });
    return result as string | null;
  } catch (error) {
    console.error("Failed to select folder:", error);
    return null;
  }
}

/**
 * Show a confirmation dialog
 */
export async function confirmDialog(
  title: string,
  message: string
): Promise<boolean> {
  if (!isTauri()) {
    return window.confirm(message);
  }

  try {
    const { confirm } = await import("@tauri-apps/plugin-dialog");
    return await confirm(message, { title });
  } catch (error) {
    console.error("Failed to show dialog:", error);
    return false;
  }
}

/**
 * Show a message dialog
 */
export async function messageDialog(
  title: string,
  message: string,
  kind: "info" | "warning" | "error" = "info"
): Promise<void> {
  if (!isTauri()) {
    alert(message);
    return;
  }

  try {
    const { message: showMessage } = await import("@tauri-apps/plugin-dialog");
    await showMessage(message, { title, kind });
  } catch (error) {
    console.error("Failed to show message:", error);
  }
}

export default {
  savePdfToFile,
  selectFolder,
  confirmDialog,
  messageDialog,
};
