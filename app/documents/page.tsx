"use client";

import { Card } from "@/components/ui/card";
import { FileText, FolderOpen } from "lucide-react";
import { useTauri } from "@/hooks/use-tauri";

export default function DocumentsPage() {
  const { isDesktop } = useTauri();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Documents</h2>
        <p className="text-muted-foreground">
          Company documents and file management
        </p>
      </div>

      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Document Storage</h3>
        <p className="text-muted-foreground max-w-md">
          {isDesktop
            ? "Connect to your local file system or cloud storage to manage documents."
            : "Document management features coming soon. Connect with Dropbox or other cloud services."}
        </p>
      </Card>

      {/* Placeholder for future document list */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 opacity-50">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
