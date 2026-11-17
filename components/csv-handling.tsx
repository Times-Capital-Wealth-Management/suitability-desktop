import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import clientDb, { type Client } from "@/lib/database";
import { useRef, useState } from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Splits one CSV line into values, respecting "quoted, values" and "" escapes
function splitCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"' && line[i + 1] === '"') {
                current += '"';
                i++;
            } else if (ch === '"') {
                inQuotes = false;
            } else {
                current += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === ",") {
            values.push(current.trim());
            current = "";
        } else {
            current += ch;
        }
    }
    values.push(current.trim());
    return values;
}

export default function CsvImportHandling() {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [pendingClients, setPendingClients] = useState<Client[] | null>(null);

    const parseCSV = (rawText: string): Client[] => {
        const csvText = rawText.replace(/^\uFEFF/, ""); // strip BOM
        const lines = csvText.trim().split(/\r\n|\n|\r/); // CR, LF or CRLF
        if (lines.length < 2) return [];

        const headers = splitCSVLine(lines[0]);
        const clients: Client[] = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].trim();
            if (!currentLine) continue;

            const values = splitCSVLine(currentLine);
            const row: any = {};

            headers.forEach((header, index) => {
                if (header === "lossPct") {
                    row[header] = parseFloat(values[index]) || 0;
                } else {
                    row[header] = values[index];
                }
            });

            if (row.firstName && row.lastName) {
                clients.push({
                    id: row.id || `c${Date.now() + i}`,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    investmentManager: row.investmentManager || null,
                    platform: row.platform,
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

    const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // allows picking the same file again
        if (!file) return;

        try {
            setLoading(true);
            const content = await file.text();
            const clients = parseCSV(content);

            if (clients.length === 0) {
                toast.error("No valid clients found in CSV");
                return;
            }
            setPendingClients(clients); // opens the confirm dialog
        } catch (error) {
            console.error("Import failed:", error);
            toast.error(`Failed to read CSV: ${String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    const confirmImport = async () => {
        if (!pendingClients) return;
        try {
            setLoading(true);
            await clientDb.replaceAll(pendingClients);
            toast.success(`Imported ${pendingClients.length} clients`);
        } catch (error) {
            console.error("Import failed:", error);
            toast.error(`Import failed: ${String(error)}`);
        } finally {
            setPendingClients(null);
            setLoading(false);
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileChosen}
            />

            <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
            >
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Importing..." : "Import CSV"}
            </Button>

            <AlertDialog
                open={pendingClients !== null}
                onOpenChange={(open) => { if (!open) setPendingClients(null); }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Import</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will REPLACE all existing data with {pendingClients?.length} clients
                            from the CSV. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmImport}>Replace all data</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export function CsvExportHandling() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);

            const clients = (await clientDb.getAll()).items;

            if (!clients.length) {
                toast.info("No clients to export.");
                return;
            }

            const headers = [
                "id", "firstName", "lastName", "investmentManager", "platform", "knowledgeExperience",
                "lossPct", "accountNumber", "typeAccount", "salutation", "objective", "risk",
                "email", "phone", "address", "powerOfAttorney", "annualReviewDate", "feesCommissionRate"
            ];

            const csv = [
                headers.join(","),
                ...clients.map(c =>
                    headers.map(h => JSON.stringify((c as any)[h] ?? "")).join(",")
                )
            ].join("\n");

            const path = await save({
                defaultPath: "clients-export.csv",
                filters: [{ name: "CSV", extensions: ["csv"] }]
            });

            if (!path) return;

            await writeFile(path, new TextEncoder().encode(csv));

            toast.success("Data exported successfully!");
        } catch (error) {
            console.error("Export failed:", error);
            toast.error(`Export failed: ${String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export CSV"}
        </Button>
    );
}


// import {Upload, Download} from "lucide-react";
// import {Button} from "@/components/ui/button";
// import fileUtils from "@/lib/file-utils";
// import clientDb, { type Client } from "@/lib/database";
// import { useState } from "react";
// import {save} from "@tauri-apps/plugin-dialog";
// import {writeFile} from "@tauri-apps/plugin-fs";
//
// export default function CsvImportHandling() {
//     const [loading, setLoading] = useState(false);
//
//     // Simple CSV parser
//     const parseCSV = (csvText: string): Client[] => {
//         const lines = csvText.trim().split("\n");
//         if (lines.length < 2) return [];
//
//         const headers = lines[0].trim().split(",").map(h => h.trim());
//         const clients: Client[] = [];
//
//         for (let i = 1; i < lines.length; i++) {
//             const currentLine = lines[i].trim();
//             if (!currentLine) continue;
//
//             // Handle simple comma separation (doesn't handle commas inside quotes)
//             const values = currentLine.split(",").map(v => v.trim());
//             const row: any = {};
//
//             headers.forEach((header, index) => {
//                 // Handle numeric fields
//                 if (header === "lossPct") {
//                     row[header] = parseFloat(values[index]) || 0;
//                 } else {
//                     row[header] = values[index];
//                 }
//             });
//
//             // Ensure required fields and ID exist
//             if (row.firstName && row.lastName) {
//                 clients.push({
//                     id: row.id || `c${Date.now() + i}`, // Generate ID if missing
//                     firstName: row.firstName,
//                     lastName: row.lastName,
//                     investmentManager: row.investmentManager || null,
//                     platform: row.platform,
//                     knowledgeExperience: row.knowledgeExperience || "Low",
//                     lossPct: row.lossPct || 0,
//                     accountNumber: row.accountNumber || `UNK-${i}`,
//                     typeAccount: row.typeAccount,
//                     salutation: row.salutation || null,
//                     objective: row.objective || "Balanced",
//                     risk: row.risk || "Medium",
//                     email: row.email || null,
//                     phone: row.phone || null,
//                     address: row.address || null,
//                     powerOfAttorney: row.powerOfAttorney || null,
//                     annualReviewDate: row.annualReviewDate || null,
//                     feesCommissionRate: row.feesCommissionRate || null,
//                 } as Client);
//             }
//         }
//         return clients;
//     };
//
//     const handleImport = async () => {
//         try {
//             setLoading(true);
//             const filePath = await fileUtils.selectTextFile();
//             if (!filePath) {
//                 setLoading(false);
//                 return;
//             }
//
//             const content = await fileUtils.readTextFile(filePath);
//             const clients = parseCSV(content);
//
//             if (clients.length === 0) {
//                 await fileUtils.messageDialog("Error", "No valid clients found in CSV", "error");
//                 setLoading(false);
//                 return;
//             }
//
//             const confirmed = await fileUtils.confirmDialog(
//                 "Confirm Import",
//                 `This will REPLACE all existing data with ${clients.length} clients from the CSV. Are you sure?`
//             );
//
//             if (confirmed) {
//                 await clientDb.replaceAll(clients);
//                 await fileUtils.messageDialog("Success", "Data imported successfully!", "info");
//             }
//         } catch (error) {
//             console.error("Import failed:", error);
//             await fileUtils.messageDialog("Error", "Failed to import data.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return(
//         <Button
//             variant="outline"
//             size="sm"
//             onClick={handleImport}
//             disabled={loading}
//         >
//             <Download className="mr-2 h-4 w-4" />
//             {loading ? "Importing..." : "Import CSV"}
//         </Button>
//     );
// }
//
// export function CsvExportHandling() {
//     const [loading, setLoading] = useState(false);
//
//     const handleExport = async () => {
//         try {
//             setLoading(true);
//
//             const clients = (await clientDb.getAll()).items;
//
//             if (!clients.length) {
//                 await fileUtils.messageDialog("Info", "No clients to export.", "info");
//                 return;
//             }
//
//             const headers = [
//                 "id","firstName","lastName","investmentManager","platform","knowledgeExperience",
//                 "lossPct","accountNumber","typeAccount","salutation","objective","risk",
//                 "email","phone","address","powerOfAttorney","annualReviewDate","feesCommissionRate"
//             ];
//
//             const csv = [
//                 headers.join(","),
//                 ...clients.map(c =>
//                     headers.map(h => JSON.stringify((c as any)[h] ?? "")).join(",")
//                 )
//             ].join("\n");
//
//             const path = await save({
//                 defaultPath: "clients-export.csv",
//                 filters: [{ name: "CSV", extensions: ["csv"] }]
//             });
//
//             if (!path) return;
//
//             await writeFile(path, new TextEncoder().encode(csv));
//
//
//
//             await fileUtils.messageDialog("Success", "Data exported successfully!", "info");
//         } catch (error) {
//             console.error("Export failed:", error);
//             await fileUtils.messageDialog("Error", "Failed to export data.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
//             <Upload className="mr-2 h-4 w-4" />
//             {loading ? "Exporting..." : "Export CSV"}
//         </Button>
//     );
// }
