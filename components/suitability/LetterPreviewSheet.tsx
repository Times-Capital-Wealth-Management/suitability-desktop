"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { SuitabilityFormState } from "./SuitabilityWorkspace";

export default function LetterPreviewSheet({ form }: { form: SuitabilityFormState }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button type="button">Preview letter</Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-[560px] pt-12 sm:pt-14 overflow-scroll">
                <SheetHeader className="sr-only">
                    <SheetTitle>Suitability letter preview</SheetTitle>
                </SheetHeader>

                <div className="mx-auto max-w-md">
                    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">Client</div>
                            <div className="mt-1 text-base font-medium">
                                {form.salutation ? `${form.salutation} ` : ""}
                                {form.clientName || "Client Name"}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                Account: {form.accountNumber || "—"}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4 text-sm">

                            <p>
                                The purpose of this report is to relay to you the client the information you have
                                supplied to the firm with regards to your investment preferences, objectives and other
                                personal characteristics. This was gathered from the information you provided on your
                                on-boarding application form, which has been used to assess your suitability for our
                                advisory services. By assessing your suitability, it enables the firm to act in your
                                best interests. If any aspects of this report are unclear or you would like to discuss
                                any areas further, please do not hesitate to contact us.
                            </p>

                            <p className="uppercase font-bold">
                               Recommendation - {form.trades[0].side}
                            </p>

                            {/* Trades */}
                            <div className="pt-2 space-y-3">
                                {/*
                                 <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Proposed Transactions
                                </div>*/}

                                {form.trades.length === 0 ? (
                                    <div>No trades entered.</div>
                                ) : (
                                    <ol className="space-y-4">
                                        {form.trades.map((t, i) => (
                                            <li key={i} >
                                                <div className="font-medium rounded-lg border p-3">
                                                    {t.side} {t.quantity || "___"} of <strong>{t.assetName || "________"}</strong>{" "}
                                                    ({t.accountType}) — type: {t.assetType || "—"}, asset risk: {t.assetRisk},
                                                    time: {t.timeOfTrade || "—"}.
                                                </div>

                                                {/* Reasons for this trade */}
                                                {/* <div className="mt-2">
                                                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                                        Reasons
                                                    </div>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {t.reasons.filter(Boolean).length ? (
                                                            t.reasons.map((r, idx) => <li key={idx}>{r}</li>)
                                                        ) : (
                                                            <li>No reasons provided for this trade.</li>
                                                        )}
                                                    </ul>
                                                </div> */}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                            <p>
                                Dear {form.salutation || "…"} {form.clientName || "…"},
                            </p>

                            {/* Trade Reasons */}
                            <div className="pt-2 space-y-3">
                                {/*
                                 <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Proposed Transactions
                                </div>*/}

                                {form.trades.length === 0 ? (
                                    <div>No trades entered.</div>
                                ) : (
                                    <ol className="space-y-4">
                                        {form.trades.map((t, i) => (
                                            <li key={i} >
                                                {/* Reasons for this trade */}
                                                <div className="mt-2">
                                                    <div>
                                                        {/* Reasons */}
                                                        {t.assetName} would be classified as a {t.assetRisk} investment
                                                        and with consideration  to you overall risk profile and
                                                        investment objectives. We believe as  part of your overall
                                                        portfolio it is suitable for you to {t.side}  because of the
                                                        following reasons:
                                                    </div>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {t.reasons.filter(Boolean).length ? (
                                                            t.reasons.map((r, idx) => <li key={idx}>{r}</li>)
                                                        ) : (
                                                            <li>No reasons provided for this trade.</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>

                            {/* <p className="pt-2">
                                If you have any questions, please contact{" "}
                                <strong>{form.investmentManager || "your investment manager"}</strong>.
                            </p> */}

                            <p>
                                <strong><u> Your Relevant Knowledge and Experience</u></strong> <br />
                                The recommendation is considered to suit your relevant knowledge and experience as the
                                firm has assessed you to have a good understanding of equities.
                            </p>
                            <p>

                                <strong><u> Periodic Review of Suitability </u></strong> <br />
                                Investing in equities will require us to perform periodic reviews to assess your
                                continued suitability to the product. By following this advice and opening / closing the
                                recommended instrument, you will be agreeing to the following conditions: <br />


                                1.	A suitability assessment will be performed at least annually. <br />

                                2.	The following information may be subject to full/partial reassessment; <br/>
                                (i)	Your investment objectives <br />
                                (ii)	Your risk tolerance <br />
                                (iii)	Your capacity for loss <br />

                                3.	A suitability re-assessment will be required should your financial circumstances
                                change at any time. <br />

                                4.	If it is decided that you are no longer suitable for this product, an updated
                                recommendation will be communicated to you by e-mail. <br />
                            </p>
                            <p>
                                <strong> Declaration:</strong> It is strongly advised that you read all the information
                                set out in this report for your own benefit and protection. If you do not understand any
                                point or your personal circumstances have changed please contact us on 0203 950 3751.
                            </p>

                            {/* <p className="pt-2">Kind regards,</p> */}
                            <p className="font-medium"> Signed {form.investmentManager || "Investment Manager"}</p>
                        </div>
                    </div>

                    <SheetFooter className="mt-6">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" className="w-full rounded-xl">
                                Close
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}