"use client";

import RouteTitle from "./route-title";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "@/components/theme-toggle"; // ✅ import toggle

export default function TopBar() {
    return (
        <header className="flex h-14 items-center justify-between border-b pl-8 pr-6">
            <RouteTitle />

            <div className="flex items-center gap-3">
                <SearchBar />
                <ThemeToggle /> {/* ✅ sits next to SearchBar */}
            </div>
        </header>
    );
}