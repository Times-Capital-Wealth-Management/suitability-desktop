"use client";

import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { Home, BarChart, FileText, Settings, BookUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// user (wire to session later)
const user = {
    name: "Turon Miah",
    role: "Advisor",
    email: "advisor@company.com",
    image: null as string | null,
};

function initials(fullName: string) {
    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]!.toUpperCase())
        .join("");
}

export function AppSidebar() {
    const { state } = useSidebar(); // "expanded" | "collapsed" | "mobile"
    const brandRef = useRef<HTMLDivElement | null>(null);
    const [sidebarWidth, setSidebarWidth] = useState<number | undefined>(undefined);

    // Recalculate width so the brand fits on a single line
    const recalc = () => {
        if (!brandRef.current) return;
        // text width + internal padding (trigger + gaps + left/right padding)
        const textW = Math.ceil(brandRef.current.scrollWidth);
        const padding = 48; // ~ trigger + gaps
        const sidePadding = 24; // px-2 (8) + py + some breathing room
        const target = textW + padding + sidePadding;

        // clamp between 240 and 360px (tweak as you like)
        const next = Math.min(Math.max(target, 240), 360);
        setSidebarWidth(next);
    };

    useLayoutEffect(recalc, []);
    useEffect(() => {
        // update when expanded/collapsed or on resize
        recalc();
        const ro = new ResizeObserver(recalc);
        if (brandRef.current) ro.observe(brandRef.current);
        const onResize = () => recalc();
        window.addEventListener("resize", onResize);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [state]);

    return (
        <Sidebar
            collapsible="icon"
            // set CSS var for expanded state; collapsed width uses --sidebar-width-icon
            style={
                sidebarWidth
                    ? ({ ["--sidebar-width" as any]: `${sidebarWidth}px` } as React.CSSProperties)
                    : undefined
            }
            className="transition-[width] duration-200"
        >
            {/* Brand + trigger */}
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-3">
                    <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
                    {/* This element’s width is measured */}
                    <div
                        ref={brandRef}
                        className="text-xs font-semibold whitespace-nowrap truncate"
                        title="Vinco Wealth Management"
                    >
                        Vinco Wealth Management
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Overview */}
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <Home />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/suitability" className="flex items-center gap-2">
                                    <BarChart />
                                    <span>Suitability</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/documents" className="flex items-center gap-2">
                                    <FileText />
                                    <span>Documents</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/clients" className="flex items-center gap-2">
                                    <BookUser />
                                    <span>Clients</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Administration */}
                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/settings" className="flex items-center gap-2">
                                    <Settings />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* User footer */}
            <SidebarFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center gap-2 px-1 py-3 text-left" aria-label="Open user menu">
                            <Avatar className="h-6 w-6">
                                {user.image ? (
                                    <AvatarImage src={user.image} alt={user.name} />
                                ) : (
                                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                                )}
                            </Avatar>
                            {state !== "collapsed" && (
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-medium">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.role}</span>
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" asChild>
                            <button type="button">Sign out</button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
