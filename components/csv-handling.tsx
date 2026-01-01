import {Upload} from "lucide-react";
import {Button} from "@/components/ui/button";
import fileUtils from "@/lib/file-utils";
import clientDb, { type Client } from "@/lib/database";
import { useState } from "react";

export default function CsvImportHandling() {
    const [loading, setLoading] = useState(false);

    // Simple CSV parser
    const parseCSV = (csvText: string): Client[] => {
        const lines = csvText.trim().split("\n");
        if (lines.length < 2) return [];

        const headers = lines[0].trim().split(",").map(h => h.trim());
        const clients: Client[] = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].trim();
            if (!currentLine) continue;

            // Handle simple comma separation (doesn't handle commas inside quotes)
            const values = currentLine.split(",").map(v => v.trim());
            const row: any = {};

            headers.forEach((header, index) => {
                // Handle numeric fields
                if (header === "lossPct") {
                    row[header] = parseFloat(values[index]) || 0;
                } else {
                    row[header] = values[index];
                }
            });

            // Ensure required fields and ID exist
            if (row.firstName && row.lastName) {
                clients.push({
                    id: row.id || `c${Date.now() + i}`, // Generate ID if missing
                    firstName: row.firstName,
                    lastName: row.lastName,
                    investmentManager: row.investmentManager || null,
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

    const handleImport = async () => {
        try {
            setLoading(true);
            const filePath = await fileUtils.selectTextFile();
            if (!filePath) {
                setLoading(false);
                return;
            }

            const content = await fileUtils.readTextFile(filePath);
            const clients = parseCSV(content);

            if (clients.length === 0) {
                await fileUtils.messageDialog("Error", "No valid clients found in CSV", "error");
                setLoading(false);
                return;
            }

            const confirmed = await fileUtils.confirmDialog(
                "Confirm Import",
                `This will REPLACE all existing data with ${clients.length} clients from the CSV. Are you sure?`
            );

            if (confirmed) {
                await clientDb.replaceAll(clients);
                await fileUtils.messageDialog("Success", "Data imported successfully!", "info");
            }
        } catch (error) {
            console.error("Import failed:", error);
            await fileUtils.messageDialog("Error", "Failed to import data.", "error");
        } finally {
            setLoading(false);
        }
    };

    return(
        <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            disabled={loading}
        >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Importing..." : "Import CSV"}
        </Button>
    );
}