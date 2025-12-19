import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

// Fetch font and convert to base64 data URI (required for Tauri's tauri:// protocol)
async function fetchFontAsDataUri(path: string): Promise<string> {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const response = await fetch(`${baseUrl}${path}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch font: ${path} (${response.status})`);
    }

    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], { type: 'font/truetype' });

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Register PDF fonts at runtime (call before generating PDFs)
export async function registerPDFFonts(): Promise<void> {
    if (fontsRegistered || typeof window === 'undefined') return;

    const [
        carlitoRegular,
        carlitoBold,
        carlitoItalic,
        carlitoBoldItalic,
        dancingRegular,
        dancingBold,
    ] = await Promise.all([
        fetchFontAsDataUri('/fonts/Carlito/Carlito-Regular.ttf'),
        fetchFontAsDataUri('/fonts/Carlito/Carlito-Bold.ttf'),
        fetchFontAsDataUri('/fonts/Carlito/Carlito-Italic.ttf'),
        fetchFontAsDataUri('/fonts/Carlito/Carlito-BoldItalic.ttf'),
        fetchFontAsDataUri('/fonts/Dancing_Script/static/DancingScript-Regular.ttf'),
        fetchFontAsDataUri('/fonts/Dancing_Script/static/DancingScript-Bold.ttf'),
    ]);

    Font.register({
        family: "Carlito",
        fonts: [
            { src: carlitoRegular },
            { src: carlitoBold, fontWeight: "bold" },
            { src: carlitoItalic, fontStyle: "italic" },
            { src: carlitoBoldItalic, fontStyle: "italic", fontWeight: "bold" },
        ],
    });

    Font.register({
        family: "DancingScript",
        fonts: [
            { src: dancingRegular },
            { src: dancingBold, fontWeight: "bold" },
        ],
    });

    fontsRegistered = true;
}
