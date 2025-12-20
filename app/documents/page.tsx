'use client';

import React, { useEffect, useState } from 'react';
import { BaseDirectory, readDir, remove, stat } from '@tauri-apps/plugin-fs';
import DocumentList from './document-list';
import { isTauri } from '@/lib/tauri';

type FileData = {
    name: string;
    created: string;
};

export default function Page() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFiles = async () => {
        // Guard: If not running in Tauri (e.g. browser dev), stop here
        if (!isTauri()) {
            console.log("Not in Tauri environment");
            setLoading(false);
            return;
        }

        try {
            // 1. Read the Suitability directory inside Documents
            const entries = await readDir('Suitability', {
                baseDir: BaseDirectory.Document,
            });

            // 2. Filter for PDFs and get their creation stats
            const filePromises = entries
                .filter((entry) => entry.isFile && entry.name.endsWith('.pdf'))
                .map(async (entry) => {
                    try {
                        const metadata = await stat(`Suitability/${entry.name}`, {
                            baseDir: BaseDirectory.Document
                        });

                        // FIX: use 'birthtime' (lowercase) and fallback to mtime
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

            // 3. Resolve all promises and filter out any failed reads
            const results = await Promise.all(filePromises);
            const validFiles = results.filter((f): f is FileData => f !== null);

            // 4. Sort by newest first
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
        if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

        try {
            await remove(`Suitability/${fileName}`, {
                baseDir: BaseDirectory.Document
            });
            // Refresh the list after deletion
            loadFiles();
        } catch (error) {
            console.error("Failed to delete file:", error);
            alert("Failed to delete file");
        }
    };

    return (
        <div className="min-h-screen bg-white p-8 md:p-12">
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Suitability Files</h1>
                <p className="text-gray-500 mt-1 text-sm">Manage your generated suitability reports.</p>
            </div>

            {loading ? (
                <div className="max-w-3xl mx-auto text-sm text-gray-500">Loading documents...</div>
            ) : (
                <DocumentList files={files} onDelete={handleDelete} />
            )}
        </div>
    );
}