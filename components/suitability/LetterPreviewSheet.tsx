"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { SuitabilityFormState } from "./SuitabilityWorkspace";

export default function LetterPreviewModal({ form }: { form: SuitabilityFormState }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                    <FileText className="mr-2 h-4 w-4" />
                    Preview Letter
                </Button>
            </DialogTrigger>

            {/* UPDATED: max-w-5xl makes it wider, h-[85vh] keeps it tall but fits in screen */}
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-muted/40">
                    <DialogTitle>Suitability Letter Preview</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-slate-100/50 p-4 md:p-8 dark:bg-slate-900/50">
                    {/* Paper Document Container - Fixed A4 width (210mm) centered */}
                    <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl rounded-sm p-8 md:p-12 text-sm leading-relaxed">

                        {/* Header Info */}
                        <div className="mb-8 border-b pb-4">
                            <h2 className="text-lg font-bold">
                                {form.salutation ? `${form.salutation} ` : ""}
                                {form.clientName || "Client Name"}
                            </h2>
                            <p className="text-slate-500 text-xs mt-1">
                                Account: {form.accountNumber || "—"}
                            </p>
                        </div>

                        {/* Letter Body */}
                        <div className="space-y-4">
                            <p className="text-justify">
                                The purpose of this report is to relay to you the client the information you have
                                supplied to the firm with regards to your investment preferences, objectives and other
                                personal characteristics. This was gathered from the information you provided on your
                                on-boarding application form, which has been used to assess your suitability for our
                                advisory services. By assessing your suitability, it enables the firm to act in your
                                best interests. If any aspects of this report are unclear or you would like to discuss
                                any areas further, please do not hesitate to contact us.
                            </p>

                            <div className="py-2">
                                <span className="uppercase font-bold border-b-2 border-slate-200 pb-1">
                                    Recommendation - {form.trades[0]?.side || "—"}
                                </span>
                            </div>

                            {/* Trades List */}
                            {form.trades.length === 0 ? (
                                <div className="italic text-slate-500">No trades entered.</div>
                            ) : (
                                <div className="space-y-6">
                                    {form.trades.map((t, i) => (
                                        <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <div className="font-semibold text-base mb-2">
                                                {t.side} {t.quantity || "___"} of {t.assetName || "________"} ({t.accountType})
                                            </div>
                                            <div className="text-xs text-slate-500 mb-3 font-mono">
                                                Type: {t.assetType || "—"} | Risk: {t.assetRisk} | Time: {t.timeOfTrade || "—"}
                                            </div>

                                            <div className="text-slate-700">
                                                {t.assetName} would be classified as a <strong>{t.assetRisk}</strong> investment.
                                                We believe as part of your overall portfolio it is suitable for you to {t.side} because:
                                            </div>

                                            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700">
                                                {t.reasons.filter(Boolean).length ? (
                                                    t.reasons.map((r, idx) => <li key={idx}>{r}</li>)
                                                ) : (
                                                    <li className="italic text-slate-400">No specific reasons provided.</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="pt-4">
                                Dear {form.salutation || "…"} {form.clientName || "…"},
                            </p>

                            <div className="space-y-4 pt-2">
                                <div>
                                    <div className="font-bold underline mb-1">Your Relevant Knowledge and Experience</div>
                                    <p>The recommendation is considered to suit your relevant knowledge and experience as the firm has assessed you to have a good understanding of equities.</p>
                                </div>

                                <div>
                                    <div className="font-bold underline mb-1">Periodic Review of Suitability</div>
                                    <p className="mb-2">
                                        Investing in equities will require us to perform periodic reviews to assess your continued suitability to the product. By following this advice, you agree to:
                                    </p>
                                    <ol className="list-decimal pl-5 space-y-1">
                                        <li>A suitability assessment will be performed at least annually.</li>
                                        <li>Your investment objectives, risk tolerance, and capacity for loss may be reassessed.</li>
                                        <li>A suitability re-assessment will be required should your financial circumstances change.</li>
                                        <li>If you are no longer suitable, an updated recommendation will be communicated.</li>
                                    </ol>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 p-4 rounded text-sm mt-4">
                                    <strong>Declaration:</strong> It is strongly advised that you read all the information
                                    set out in this report for your own benefit and protection. If you do not understand any
                                    point or your personal circumstances have changed please contact us on 0203 950 3751.
                                </div>

                                <div className="pt-6 font-medium font-handwriting text-xl">
                                    Signed: {form.investmentManager || "Investment Manager"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-background">
                    <DialogClose asChild>
                        <Button variant="outline">Close Preview</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}