// Type definitions and helpers for Tauri API

// Check if running in Tauri environment
export const isTauri = (): boolean => {
  if (typeof window === "undefined") return false;
  return "__TAURI__" in window || "__TAURI_INTERNALS__" in window;
};

// Generic invoke function with type safety
export async function invoke<T>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T | null> {
  if (!isTauri()) {
    console.warn(`Tauri not available. Command "${cmd}" skipped.`);
    return null;
  }
  
  try {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return await tauriInvoke<T>(cmd, args);
  } catch (error) {
    console.error(`Failed to invoke ${cmd}:`, error);
    return null;
  }
}

// Example typed commands matching src-tauri/src/main.rs
export const tauriCommands = {
  greet: (name: string) => invoke<string>("greet", { name }),
  getAppVersion: () => invoke<string>("get_app_version"),
};

export {};
