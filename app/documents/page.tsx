import fs from 'node:fs';
import path from 'node:path';
import DocumentList from './document-list';

export default function Page() {
    // Corrected path to match screenshot: Documents/Suitability
    const dirPath = path.join(process.cwd(), 'Documents/Suitability');

    let files: { name: string; created: string }[] = [];

    try {
        if (fs.existsSync(dirPath)) {
            files = fs.readdirSync(dirPath)
                .filter(file => file.endsWith('.pdf')) // Filter for PDFs only
                .map((file) => {
                    const stats = fs.statSync(path.join(dirPath, file));
                    return {
                        name: file,
                        created: stats.birthtime.toISOString(),
                    };
                })
                .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        }
    } catch (error) {
        console.error('Error reading documents:', error);
    }

    return (
        <div className="min-h-screen bg-white p-8 md:p-12">
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Suitability Files</h1>
                <p className="text-gray-500 mt-1 text-sm">Manage your generated suitability reports.</p>
            </div>
            <DocumentList files={files} />
        </div>
    );
}