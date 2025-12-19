"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Home, FileText, Settings, BarChart3, BookUser } from "lucide-react";

const MAP: Record<string, { label: string; Icon?: React.ComponentType<any> }> = {
    "": { label: "Home", Icon: Home },        // "/"
    home: { label: "Home", Icon: Home },
    suitability: { label: "Suitability", Icon: BarChart3 },
    documents: { label: "Documents", Icon: FileText },
    clients: { label: "Clients", Icon: BookUser }, // ✅ added
    settings: { label: "Settings", Icon: Settings },
};

function toTitle(slug: string) {
    return slug
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
}

export default function RouteTitle() {
    const pathname = usePathname();
    const key = useMemo(() => pathname.split("/").filter(Boolean)[0] ?? "", [pathname]);
    const meta = MAP[key] ?? { label: toTitle(key) || "Home" };

    const Icon = meta.Icon;
    return (
        <div className="flex items-center gap-2">
            {Icon ? <Icon className="h-5 w-5" /> : null}
            <h1 className="text-lg font-semibold">{meta.label}</h1>
        </div>
    );
}