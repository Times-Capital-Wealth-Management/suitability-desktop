"use client";

export default function Error({ error }: { error: Error }) {
    return (
        <div className="p-6 text-sm text-red-600">
            Failed to load reports: {error.message}
        </div>
    );
}
