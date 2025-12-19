"use client";

import { useTauri, useAppVersion } from "@/hooks/use-tauri";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { BarChart, FileText, BookUser, Settings } from "lucide-react";

export default function Home() {
  const { isDesktop, isLoading } = useTauri();
  const appVersion = useAppVersion();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Times Capital
        </h1>
        <p className="text-muted-foreground">
          Wealth Management Platform
          {!isLoading && (
            <span className="ml-2 text-xs">
              {isDesktop ? "📦 Desktop App" : "🌐 Web App"}
              {appVersion && ` v${appVersion}`}
            </span>
          )}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/suitability">
          <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Suitability</h3>
                <p className="text-sm text-muted-foreground">
                  Create letters
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/clients">
          <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookUser className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Clients</h3>
                <p className="text-sm text-muted-foreground">
                  Manage clients
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/documents">
          <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Documents</h3>
                <p className="text-sm text-muted-foreground">
                  View files
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/settings">
          <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure app
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Desktop-only features notice */}
      {!isLoading && isDesktop && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-2">Desktop Features Enabled</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Local SQLite database for offline access</li>
            <li>✓ Native file save dialogs for PDFs</li>
            <li>✓ Faster performance with native rendering</li>
          </ul>
        </Card>
      )}
    </div>
  );
}
