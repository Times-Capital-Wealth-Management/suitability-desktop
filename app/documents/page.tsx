"use client";

import React, { useEffect, useState } from 'react';
import { BaseDirectory, readDir, remove, stat, exists, mkdir } from '@tauri-apps/plugin-fs';
import DocumentList from './document-list';
import { isTauri } from '@/lib/tauri';
import { confirmDialog } from '@/lib/file-utils';
import { Card } from "@/components/ui/card";
import { FileText, FolderOpen } from "lucide-react";

type FileData = {
    name: string;
    created: string;
};

export default function DocumentsPage() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const folderName = 'Suitability';

    const loadFiles = async () => {
        if (!isTauri()) {
            console.log("Not in Tauri environment");
            setLoading(false);
            return;
        }

        try {
            // 1. Ensure the directory exists first to avoid errors
            const dirExists = await exists(folderName, { baseDir: BaseDirectory.Document });
            if (!dirExists) {
                // If it doesn't exist, just create it silently or return empty
                await mkdir(folderName, { baseDir: BaseDirectory.Document, recursive: true });
                setFiles([]);
                setLoading(false);
                return;
            }

            // 2. Read the Suitability directory using BaseDirectory
            const entries = await readDir(folderName, {
                baseDir: BaseDirectory.Document,
            });

            // 3. Filter for PDFs and get metadata
            const filePromises = entries
                .filter((entry) => entry.isFile && entry.name.endsWith('.pdf'))
                .map(async (entry) => {
                    try {
                        // Use relative path matching the save logic
                        const metadata = await stat(`${folderName}/${entry.name}`, {
                            baseDir: BaseDirectory.Document
                        });

                        const date = metadata.birthtime || metadata.mtime || new Date();

                        return {
                            name: entry.name,
                            created: new Date(date).toISOString(),
                        };
                    } catch (e) {
                        console.error(`Failed to stat file ${entry.name}`, e);
                        return null;
                    }
                });

            const results = await Promise.all(filePromises);
            const validFiles = results.filter((f): f is FileData => f !== null);

            validFiles.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
            setFiles(validFiles);
        } catch (error) {
            console.error('Error reading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleDelete = async (fileName: string) => {
        const confirmed = await confirmDialog(
            'Delete Document',
            `Are you sure you want to delete ${fileName}?`
        );

        if (!confirmed) return;

        try {
            // Delete using relative path
            await remove(`${folderName}/${fileName}`, {
                baseDir: BaseDirectory.Document
            });
            loadFiles();
        } catch (error) {
            console.error("Failed to delete file:", error);
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex items-start gap-4 border-b pb-6 border-border/40">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                    <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Suitability Files
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Manage your generated suitability reports and documents.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 w-full rounded-xl bg-muted/40 animate-pulse" />
                    ))}
                </div>
            ) : files.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed border-2 bg-muted/5 rounded-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 shadow-sm">
                        <FolderOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">No documents found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Generate a report in the Suitability tab to see it here.
                    </p>
                </Card>
            ) : (
                <Card className="rounded-2xl border shadow-sm bg-card overflow-hidden transition-all hover:shadow-md">
                    <DocumentList files={files} onDelete={handleDelete} />
                </Card>
            )}
        </div>
    );
}