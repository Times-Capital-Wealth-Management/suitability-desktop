"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTauri, useAppVersion } from "@/hooks/use-tauri";
import { ThemeToggle } from "@/components/theme-toggle";
import { Database, Info, Palette } from "lucide-react";

export default function SettingsPage() {
  const { isDesktop } = useTauri();
  const appVersion = useAppVersion();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground">
          Configure your application preferences
        </p>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Theme</Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Database (Desktop only) */}
      {isDesktop && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Database</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Local Storage</Label>
              <p className="text-sm text-muted-foreground">
                Using SQLite database: timescapital.db
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                Import Data
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">About</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application</span>
            <span>Times Capital Wealth Management</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span>{appVersion || "1.0.0"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform</span>
            <span>{isDesktop ? "Desktop (Tauri)" : "Web Browser"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
