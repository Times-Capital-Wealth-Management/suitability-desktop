"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function ContentContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="pl-8 pr-6 pt-4 pb-6">
            {children}
        </div>
    );
}

