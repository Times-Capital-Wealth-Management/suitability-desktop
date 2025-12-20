'use client';

import React, { useState } from 'react';

type FileData = {
    name: string;
    created: string;
};

// Add onDelete to props
type DocumentListProps = {
    files: FileData[];
    onDelete: (fileName: string) => void;
};

export default function DocumentList({ files, onDelete }: DocumentListProps) {
    const [view, setView] = useState<'all' | 'today'>('all');

    const isToday = (dateStr: string) => {
        const d = new Date(dateStr);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    };

    const filtered = view === 'today' ? files.filter((f) => isToday(f.created)) : files;

    return (
        <div className="max-w-3xl mx-auto font-sans text-gray-800">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setView('all')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        view === 'all'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    All Documents
                </button>
                <button
                    onClick={() => setView('today')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        view === 'today'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Today
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.map((file) => (
                    <div
                        key={file.name}
                        className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center gap-4">
                            {/* PDF Icon Placeholder */}
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded flex items-center justify-center font-bold text-xs">
                                PDF
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{file.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {new Date(file.created).toLocaleDateString(undefined, {
                                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => onDelete(file.name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md font-medium"
                        >
                            Delete
                        </button>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">No documents found {view === 'today' ? 'for today' : ''}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}