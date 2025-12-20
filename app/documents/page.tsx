'use client';

import React, { useEffect, useState } from 'react';
import { BaseDirectory, readDir, remove, stat } from '@tauri-apps/plugin-fs';
import DocumentList from './document-list';
import { isTauri } from '@/lib/tauri';
// Import the native dialog helper
import { confirmDialog } from '@/lib/file-utils';

type FileData = {
    name: string;
    created: string;
};

export default function Page() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFiles = async () => {
        if (!isTauri()) {
            console.log("Not in Tauri environment");
            setLoading(false);
            return;
        }

        try {
            // 1. Read the Suitability directory
            const entries = await readDir('Suitability', {
                baseDir: BaseDirectory.Document,
            });

            // 2. Filter for PDFs and get metadata
            const filePromises = entries
                .filter((entry) => entry.isFile && entry.name.endsWith('.pdf'))
                .map(async (entry) => {
                    try {
                        const metadata = await stat(`Suitability/${entry.name}`, {
                            baseDir: BaseDirectory.Document
                        });

                        // Handle date fallback safely
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

            // Sort newest first
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
        // [!IMPORTANT] We must 'await' the result.
        // Without 'await', the code sees the Promise object as "true" and deletes immediately.
        const confirmed = await confirmDialog(
            'Delete Document',
            `Are you sure you want to delete ${fileName}?`
        );

        if (!confirmed) return;

        try {
            await remove(`Suitability/${fileName}`, {
                baseDir: BaseDirectory.Document
            });

            // Refresh list
            loadFiles();
        } catch (error) {
            console.error("Failed to delete file:", error);
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