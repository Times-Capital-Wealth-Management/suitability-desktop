"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import ContentContainer from "@/components/content-container";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Any routes that should NOT show sidebar/header:
    const hideChrome =
        pathname === "/login" ||
        pathname.startsWith("/auth"); // add more prefixes if needed

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
                <TopBar />
                <ContentContainer>{children}</ContentContainer>
            </main>
        </SidebarProvider>
    );
}
