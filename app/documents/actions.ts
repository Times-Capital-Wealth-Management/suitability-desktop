'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

// FIXED PATH: Matches your screenshot (removed '/files')
const dirPath = path.join(process.cwd(), 'documents/suitability');

export async function deleteFile(fileName: string) {
    try {
        await fs.unlink(path.join(dirPath, fileName));
        revalidatePath('/documents');
    } catch (error) {
        console.error('Delete failed:', error);
    }
}