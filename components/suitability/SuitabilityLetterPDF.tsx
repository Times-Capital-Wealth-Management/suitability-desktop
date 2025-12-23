"use client";
import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import type { SuitabilityFormState } from "./SuitabilityWorkspace";
import { registerPDFFonts } from '@/lib/fontsPDF';
import { isTauri } from "@/lib/tauri";
import { Loader2 } from "lucide-react";

const styles = StyleSheet.create({
    page:{
        padding: 10,
        paddingTop: 45,
        paddingBottom: 60,
        backgroundColor: '#ffffff',
        fontFamily: 'Carlito',
    },
    logo:{
        marginTop: 15,
        marginLeft: 135,
        marginRight: 30,
        height: 100,
        width: 300,
    },
    firstPara:{
        padding: 10,
        margin: 30,
        fontSize: 12,
        textAlign: 'justify',
    },
    section:{
        padding: 10,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 5,
        fontSize: 12,
    },
    list: {
        paddingLeft: 10,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 1,
        fontSize: 12,
    },
    subtitle: {
        paddingLeft: 10,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
    table: {
        width: "85%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#2c6da1",
        marginLeft: 42,
        marginRight: 42,
        marginTop: 10,
        marginBottom: 30,
        justifyContent: "center",
    },
    tableRow: {
        flexDirection: "row",
        borderColor: '#2c6da1',
    },
    tableColHeader: {
       borderStyle: "solid",
        borderColor: "#2c6da1",
        backgroundColor: "#2c6da1",
        padding: 6,
        borderWidth: 1,
    },
    tableCol: {
        borderStyle: "solid",
        backgroundColor: "#6eb2c6",
        padding: 6,
        borderColor: "#2c6da1",
        borderWidth:  1,
        borderBottomWidth: 0,
    },
    headerText: {
        fontFamily: "Carlito",
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
    cellText: {
        fontFamily: "Carlito",
        fontSize: 12,
    },
    footnote: {
        position: "absolute",
        fontSize: 9,
        color: 'grey',
        textAlign: 'center',
        padding: 10,
        bottom: 10,
        margin: 30,
        marginBottom: 1,
    },
    signature: {
        fontFamily: "DancingScript",
        fontSize: 20,
        marginLeft: 10,
    }
});

const dateNow = new Date().toLocaleDateString("en-GB");
const timeNow = new Date().toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});

// The actual PDF Document component
function SuitabilityLetterDoc({form}: { form: SuitabilityFormState }) {
    const recommendation = form.trades.length > 0 ? form.trades[0].side : "—";
    const quantityOrAmount = form.trades[0]?.side === "Sell" ? "Quantity" : "Amount";
    const tradeTime = form.trades.length > 0 ? form.trades[0].timeOfTrade : "—";
    const tradeDate = form.trades.length > 0 ? form.trades[0].dateOfTrade : "—";

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <Image style={styles.logo} src={"/VincoWealthLogo.png"} />

                <Text style={styles.firstPara}>
                    The purpose of this report is to relay to you the client the information you have
                    supplied to the firm with regards to your investment preferences, objectives and other
                    personal characteristics. This was gathered from the information you provided on your
                    on-boarding application form, which has been used to assess your suitability for our
                    advisory services. By assessing your suitability, it enables the firm to act in your
                    best interests. If any aspects of this report are unclear or you would like to discuss
                    any areas further, please do not hesitate to contact us.
                </Text>

                <Text style={[styles.section, {fontWeight:'bold'}, {marginBottom: 3}, {fontSize: 14}]}>
                    Recommendation - {recommendation}
                </Text>

                <View style={[styles.table]}>
                    {/* Header row */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, {width: "63%"}, {borderRightWidth: 0}]}>
                            <Text style={[styles.headerText]}>Shares</Text>
                        </View>
                        <View style={[styles.tableColHeader, {width: "25%"}, {borderLeftWidth: 0}, {borderRightWidth: 0}]}>
                            <Text style={[styles.headerText]}>{quantityOrAmount}</Text>
                        </View>
                        <View style={[styles.tableColHeader, {width: "12%"}, {borderLeftWidth: 0}]}>
                            <Text style={[styles.headerText]}>Account</Text>
                        </View>
                    </View>

                    {/* trade rows */}
                    {form.trades.map((t, i) => (
                        <View key={i}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableCol, {width: "63%"}, {borderLeftWidth: 0}]}>
                                    <Text style={[styles.cellText]}>{t.assetName}</Text>
                                </View>
                                <View style={[styles.tableCol, {width: "25%"}, {borderLeftWidth: 0}]}>
                                    <Text style={[styles.cellText]}>{t.quantity}</Text>
                                </View>
                                <View style={[styles.tableCol, {width: "12%"}, {borderLeftWidth: 0}, {borderRightWidth: 0}]}>
                                    <Text style={[styles.cellText]}>{t.accountType}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.section}>
                    Dear {form.salutation},
                </Text>

                <Text style={styles.section}>
                    Vinco Wealth Management has recommended you <Text style={{ fontWeight: "bold"}}>{recommendation.toLowerCase()}</Text> the above shares.
                    Below summarises how the recommendation is suited to your individual circumstances.
                </Text>

                <Text style={styles.subtitle}>
                    Your Investment Objectives and Risk Tolerance
                </Text>
                <Text style={styles.section}>
                    Your objective is to seek returns in the form of both income and capital appreciation ({form.objective}).
                    Your tolerance to risk is deemed <Text style={{ fontWeight: "bold"}}>{form.risk.toLowerCase()}</Text> and your capacity for loss is <Text style={{ fontWeight: "bold"}}>{form.capacityOfLoss}</Text> of the total portfolio.
                </Text>

                <View>
                    {form.trades.map((t, i) => (
                        <View key={i}>
                            <Text style={styles.section}>{t.assetName} would be classified as a <Text style={{ fontWeight: "bold"}}>{t.assetRisk.toLowerCase()}-risk</Text> investment
                                and with consideration to your overall risk profile and
                                investment objectives. We believe as part of your overall
                                portfolio it is suitable for you to <Text style={{ fontWeight: "bold"}}>{t.side.toLowerCase()}</Text> because of the
                                following reasons:
                            </Text>
                            {t.reasons.filter(Boolean).length ? (
                                t.reasons.map((r, idx) =>
                                    <Text key={idx} style={styles.list}>• {r}</Text>)
                            ) : (
                                <Text style={styles.section}>No reasons provided for this trade.</Text>
                            )}
                        </View>
                    ))}
                </View>

                <Text style={[styles.subtitle, {marginTop: 40}]}>
                    Your Relevant Knowledge and Experience
                </Text>
                <Text style={styles.section}>
                    The recommendation is considered to suit your relevant knowledge and experience as the
                    firm has assessed you to have a good understanding of equities.
                </Text>

                <Text style={[styles.subtitle]}>
                    Periodic Review of Suitability
                </Text>
                <Text style={styles.section}>
                    Investing in equities will require us to perform periodic reviews to assess your
                    continued suitability to the product. By following this advice and opening / closing the
                    recommended instrument, you will be agreeing to the following conditions:
                </Text>

                <Text style={styles.section}>
                    1.  A suitability assessment will be performed at least annually.
                </Text>
                <Text style={styles.list}>
                    2.  The following information may be subject to full/partial reassessment;
                </Text>
                <Text style={styles.list}>
                    (i) Your investment objectives
                </Text>
                <Text style={styles.list}>
                    (ii) Your risk tolerance
                </Text>
                <Text style={[styles.list, {marginBottom: 5}]}>
                    (iii) Your capacity for loss
                </Text>

                <Text style={styles.section}>
                    3.  A suitability re-assessment will be required should your financial circumstances
                    change at any time.
                </Text>

                <Text style={styles.section}>
                    4.  If it is decided that you are no longer suitable for this product, an updated
                    recommendation will be communicated to you by e-mail.
                </Text>

                <Text style={styles.section}>
                    <Text style={{fontWeight:'bold'}}>Declaration:</Text> It is strongly advised that you read
                    all the information set out in this report for your own benefit and protection. If you do
                    not understand any point or your personal circumstances have changed please contact us on
                    0203 950 3751.
                </Text>

                <Text style={styles.section}>
                    Date of trade instruction: {tradeDate}       Time of trade instruction: {tradeTime}
                </Text>

                <Text style={styles.section}>
                    Date of suitability report: {dateNow}       Time of suitability report: {timeNow}
                </Text>

                <Text style={styles.section}>
                    Signed    <Text style={styles.signature}>{form.investmentManager || "Investment Manager"}</Text>
                </Text>

                <Text style={styles.footnote} fixed>
                    Vinco Wealth Management Ltd is authorised and regulated by the Financial Conduct Authority.
                    FCA Register Number: 770606.  Company registered in England and Wales under number 8692727,
                    Registered Office: The Studio, 1 Canons Lane, Burgh Heath, Surrey KT20 6DP.
                </Text>
            </Page>
        </Document>
    );
}

// Generate filename: "ClientName - Purchase of StockName 16-12-2025.pdf"
function generateFileName(form: SuitabilityFormState): string {
    const clientName = form.clientName || "Client";
    const purchaseOrSale = form.trades[0]?.side === "Sell" ? "Sale" : "Purchase";
    const stockNames = form.trades.map(t => t.assetName).filter(Boolean).join(", ") || "Stock";
    const date = new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); // 16-12-2025

    // Clean up any invalid filename characters
    const safeName = `${clientName} - ${purchaseOrSale} of ${stockNames} ${date}.pdf`
        .replace(/[<>:"/\\|?*]/g, ""); // Remove invalid chars

    return safeName;
}

// Main export component - handles both Tauri and browser
type SuitabilityLetterPDFProps = {
    form: SuitabilityFormState;
    onBeforeSave?: () => boolean; // Optional validation callback
};

export default function SuitabilityLetterPDF({ form, onBeforeSave }: SuitabilityLetterPDFProps) {
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Run validation if provided
        if (onBeforeSave && !onBeforeSave()) {
            return; // Validation failed, don't proceed
        }

        setLoading(true);

        try {
            // Register fonts at runtime by fetching as ArrayBuffers
            // (required for Tauri production builds where tauri:// protocol isn't handled by react-pdf)
            await registerPDFFonts();

            // Generate PDF blob
            const blob = await pdf(<SuitabilityLetterDoc form={form} />).toBlob();
            const fileName = generateFileName(form);

            if (isTauri()) {
                // Tauri: Save to Documents/Suitability folder using BaseDirectory
                const { writeFile, mkdir, exists, BaseDirectory } = await import("@tauri-apps/plugin-fs");
                const { message, ask } = await import("@tauri-apps/plugin-dialog");
                const { join, documentDir } = await import("@tauri-apps/api/path");

                const folderName = "Suitability";

                // Ensure 'Suitability' folder exists in Documents (Relative check)
                const folderExists = await exists(folderName, { baseDir: BaseDirectory.Document });
                if (!folderExists) {
                    await mkdir(folderName, { baseDir: BaseDirectory.Document, recursive: true });
                }

                // Check if file exists using relative path "Suitability/filename.pdf"
                const relativePath = `${folderName}/${fileName}`;
                const fileExists = await exists(relativePath, { baseDir: BaseDirectory.Document });

                if (fileExists) {
                    const shouldReplace = await ask(
                        `A file named "${fileName}" already exists.\n\nDo you want to replace it?`,
                        {
                            title: "File Already Exists",
                            kind: "warning",
                            okLabel: "Replace",
                            cancelLabel: "Cancel"
                        }
                    );

                    if (!shouldReplace) {
                        setLoading(false);
                        return; // User cancelled, don't save
                    }
                }

                const buffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(buffer);

                // Write file using BaseDirectory.Document
                await writeFile(relativePath, uint8Array, { baseDir: BaseDirectory.Document });

                // Construct full path only for the success message
                const documentsPath = await documentDir();
                const fullDisplayPath = await join(documentsPath, folderName, fileName);

                // Show success message
                await message(`Letter saved to:\n${fullDisplayPath}`, { title: "Success", kind: "info" });
            } else {
                // Browser: Trigger download with auto-generated name
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Failed to save PDF:", error);

            // Provide more informative error messages
            if (isTauri()) {
                const { message } = await import("@tauri-apps/plugin-dialog");
                const errorMessage = error instanceof Error ? error.message : String(error);
                await message(
                    `Failed to save PDF:\n\n${errorMessage}\n\nCheck console for details.`,
                    { title: "Error", kind: "error" }
                );
            } else {
                alert("Failed to generate PDF. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <span onClick={handleSave} style={{ cursor: loading ? "wait" : "pointer" }}>
            {loading ? (
                <>
                    <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                    Generating...
                </>
            ) : (
                "Save Letter"
            )}
        </span>
    );
}