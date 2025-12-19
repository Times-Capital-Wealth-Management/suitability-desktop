"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

/**
 * Header search:
 * - Default: only a magnifying glass icon (no input box visible).
 * - On click/focus: expands into an input with transparent background.
 * - On blur/escape: collapses back to the icon.
 */
export function SearchBar() {
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    return (
        <div className="ml-auto flex items-center">
            {/* Icon button (shown when closed) */}
            {!open && (
                <button
                    aria-label="Search"
                    onClick={() => setOpen(true)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Search className="h-5 w-5" />
                </button>
            )}

            {/* Expanding input (shown when open) */}
            {open && (
                <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        onBlur={() => setOpen(false)}
                        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                        className="
              w-44 md:w-64
              bg-transparent
              outline-none
              border-0
              ring-0
              pl-8 pr-2 py-1
              text-sm
              placeholder:text-muted-foreground
              rounded-md
              transition-[width] duration-150 ease-out
              focus:w-64
            "
                    />
                </div>
            )}
        </div>
    );
}
