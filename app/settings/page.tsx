"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTauri, useAppVersion } from "@/hooks/use-tauri";
import { ThemeToggle } from "@/components/theme-toggle";
import { Database, Info, Palette, Upload } from "lucide-react";
import fileUtils from "@/lib/file-utils";
import clientDb, { type Client } from "@/lib/database";
import { useState } from "react";

export default function SettingsPage() {
  const { isDesktop } = useTauri();
  const appVersion = useAppVersion();
  const [loading, setLoading] = useState(false);

  // Simple CSV parser
  const parseCSV = (csvText: string): Client[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].trim().split(",").map(h => h.trim());
    const clients: Client[] = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      if (!currentLine) continue;

      // Handle simple comma separation (doesn't handle commas inside quotes)
      const values = currentLine.split(",").map(v => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        // Handle numeric fields
        if (header === "lossPct") {
          row[header] = parseFloat(values[index]) || 0;
        } else {
          row[header] = values[index];
        }
      });

      // Ensure required fields and ID exist
      if (row.firstName && row.lastName) {
        clients.push({
          id: row.id || `c${Date.now() + i}`, // Generate ID if missing
          firstName: row.firstName,
          lastName: row.lastName,
          investmentManager: row.investmentManager || null,
          knowledgeExperience: row.knowledgeExperience || "Low",
          lossPct: row.lossPct || 0,
          accountNumber: row.accountNumber || `UNK-${i}`,
          typeAccount: row.typeAccount,
          salutation: row.salutation || null,
          objective: row.objective || "Balanced",
          risk: row.risk || "Medium",
          email: row.email || null,
          phone: row.phone || null,
          address: row.address || null,
          powerOfAttorney: row.powerOfAttorney || null,
          annualReviewDate: row.annualReviewDate || null,
          feesCommissionRate: row.feesCommissionRate || null,
        } as Client);
      }
    }
    return clients;
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const filePath = await fileUtils.selectTextFile();
      if (!filePath) {
        setLoading(false);
        return;
      }

      const content = await fileUtils.readTextFile(filePath);
      const clients = parseCSV(content);

      if (clients.length === 0) {
        await fileUtils.messageDialog("Error", "No valid clients found in CSV", "error");
        setLoading(false);
        return;
      }

      const confirmed = await fileUtils.confirmDialog(
          "Confirm Import",
          `This will REPLACE all existing data with ${clients.length} clients from the CSV. Are you sure?`
      );

      if (confirmed) {
        await clientDb.replaceAll(clients);
        await fileUtils.messageDialog("Success", "Data imported successfully!", "info");
      }
    } catch (error) {
      console.error("Import failed:", error);
      await fileUtils.messageDialog("Error", "Failed to import data.", "error");
    } finally {
      setLoading(false);
    }
  };

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
                  <Button variant="outline" size="sm" disabled>
                    Export Data
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImport}
                      disabled={loading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {loading ? "Importing..." : "Import CSV"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  CSV headers must match: firstName, lastName, lossPct, objective, risk, etc.
                </p>
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
              <span>Vinco Wealth Management</span>
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