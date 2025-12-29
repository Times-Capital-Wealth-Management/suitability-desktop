"use client";

import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardClient } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Plus, Trash2 } from "lucide-react";
import LetterPreviewSheet from "./LetterPreviewSheet";
import dynamic from "next/dynamic";
import UpsideDownsideCalculator from "@/components/calculator";
import { ClientSelector } from "@/components/client-selector";
import { cn } from "@/lib/utils";
import { clientProvider } from "@/lib/data-provider";
import { type Client } from "@/lib/database";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown} from "lucide-react";

/* -------------------- Types -------------------- */

type Trade = {
    assetName: string;
    accountType: "ISA" | "GIA";
    assetType: "Equity" | "CFD/SB";
    assetRisk: "Low" | "Medium" | "High";
    side: "Buy" | "Sell" | "Invest";
    quantity: string;
    timeOfTrade: string;
    dateOfTrade: string;
    reasons: [string, string, string];
};

export type SuitabilityFormState = {
    clientId: string | null;
    clientName: string;
    investmentManager: string;
    knowledgeExperience: "Low" | "Medium" | "High";
    capacityOfLoss: string;
    accountNumber: string;
    salutation: string;
    objective: "Balance" | "Capital Growth" | "Income";
    risk: "Low" | "Medium" | "High";
    trades: Trade[];
};

/* -------------------- Validation Types -------------------- */

type FieldError = string | null;

type ClientErrors = {
    client: FieldError;
    investmentManager: FieldError;
    capacityOfLoss: FieldError;
    accountNumber: FieldError;
    salutation: FieldError;
};

type TradeErrors = {
    assetName: FieldError;
    quantity: FieldError;
    dateOfTrade: FieldError;
    timeOfTrade: FieldError;
    reasons: FieldError;
};

type FormErrors = {
    client: ClientErrors;
    trades: TradeErrors[];
};

const emptyClientErrors: ClientErrors = {
    client: null,
    investmentManager: null,
    capacityOfLoss: null,
    accountNumber: null,
    salutation: null,
};

const emptyTradeErrors: TradeErrors = {
    assetName: null,
    quantity: null,
    dateOfTrade: null,
    timeOfTrade: null,
    reasons: null,
};

/* -------------------- Validation Functions -------------------- */

function validateClient(form: SuitabilityFormState): ClientErrors {
    const errors: ClientErrors = { ...emptyClientErrors };

    if (!form.clientId) {
        errors.client = "Please select a client";
    }

    if (!form.investmentManager.trim()) {
        errors.investmentManager = "Investment manager is required";
    }

    if (!form.capacityOfLoss.trim()) {
        errors.capacityOfLoss = "Capacity of loss is required";
    } else if (!/^\d+%?$/.test(form.capacityOfLoss.trim())) {
        errors.capacityOfLoss = "Must be a number (e.g. 10 or 10%)";
    }

    if (!form.accountNumber.trim()) {
        errors.accountNumber = "Account number is required";
    }

    if (!form.salutation.trim()) {
        errors.salutation = "Salutation is required";
    }
    return errors;
}

function validateTrade(trade: Trade): TradeErrors {
    const errors: TradeErrors = { ...emptyTradeErrors };

    if (!trade.assetName.trim()) {
        errors.assetName = "Asset name is required";
    }

    if (!trade.quantity.trim()) {
        errors.quantity = "Quantity/Amount is required";
    } else if (!/^(([\d,]+(\.\d+)?)|Sell All)$/.test(trade.quantity.trim().replace(/[£$€]/g, ""))) {
        errors.quantity = "Must be a valid number or Sell All";
    }

    if (!trade.dateOfTrade.trim()) {
        errors.dateOfTrade = "Date is required";
    } else {
        // Validate UK date format: DD/MM/YYYY
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = trade.dateOfTrade.trim().match(dateRegex);
        if (!match) {
            errors.dateOfTrade = "Format: DD/MM/YYYY";
        } else {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            if (day < 1 || day > 31) {
                errors.dateOfTrade = "Day must be 01-31";
            } else if (month < 1 || month > 12) {
                errors.dateOfTrade = "Month must be 01-12";
            } else if (year < 2000 || year > 2100) {
                errors.dateOfTrade = "Year must be 2000-2100";
            }
        }
    }

    if (!trade.timeOfTrade.trim()) {
        errors.timeOfTrade = "Time is required";
    } else if (!/^\d{1,2}:\d{2}$/.test(trade.timeOfTrade.trim())) {
        errors.timeOfTrade = "Format: HH:MM";
    }

    const hasAtLeastOneReason = trade.reasons.some((r) => r.trim().length > 0);
    if (!hasAtLeastOneReason) {
        errors.reasons = "At least one reason is required";
    }

    return errors;
}

function validateForm(form: SuitabilityFormState): FormErrors {
    return {
        client: validateClient(form),
        trades: form.trades.map(validateTrade),
    };
}

function hasErrors(errors: FormErrors): boolean {
    const clientHasErrors = Object.values(errors.client).some((e) => e !== null);
    const tradesHaveErrors = errors.trades.some((t) => Object.values(t).some((e) => e !== null));
    return clientHasErrors || tradesHaveErrors;
}

/* -------------------- Error Display Component -------------------- */

function FieldError({ error }: { error: FieldError }) {
    if (!error) return null;
    return <p className="text-sm text-red-500 mt-1">{error}</p>;
}

/* -------------------- Component -------------------- */

export function SuitabilityWorkspace() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({
        client: emptyClientErrors,
        trades: [emptyTradeErrors],
    });
    const [showErrors, setShowErrors] = useState(false);

    const [form, setForm] = useState<SuitabilityFormState>({
        clientId: null,
        clientName: "",
        investmentManager: "",
        knowledgeExperience: "Medium",
        capacityOfLoss: "",
        accountNumber: "",
        salutation: "",
        objective: "Balance",
        risk: "Medium",
        trades: [
            {
                assetName: "",
                accountType: "ISA",
                assetType: "Equity",
                assetRisk: "Medium",
                side: "Buy",
                quantity: "",
                timeOfTrade: "",
                dateOfTrade: "",
                reasons: ["", "", ""],
            },
        ],
    });

    const SuitabilityLetterPDF = dynamic(() => import("@/components/suitability/SuitabilityLetterPDF"), { ssr: false });

    const [isOpen, setIsOpen] = React.useState(false);

    /* --------- pagination (locked to 1 per page) --------- */
    const pageSize = 1 as const;
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(form.trades.length / pageSize));
    const startIdx = (page - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, form.trades.length);
    const pagedTrades = form.trades.slice(startIdx, endIdx);

    useEffect(() => {
        setPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    /* ---------------- data loading ---------------- */
    useEffect(() => {
        let cancelled = false;
        setLoadingClients(true);

        clientProvider.getAll()
            .then((data) => {
                if (!cancelled) setClients(data.items);
            })
            .catch((err) => {
                console.error("Failed to load clients", err);
                if (!cancelled) setClients([]);
            })
            .finally(() => {
                if (!cancelled) setLoadingClients(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Load selected client details
    useEffect(() => {
        let cancelled = false;
        if (!form.clientId) return;

        clientProvider.getById(form.clientId)
            .then((c) => {
                if (cancelled || !c) return;

                // Normalize Objective: "Balanced" -> "Balance" etc.
                const validObjectives = ["Balance", "Capital Growth", "Income"];
                let normalizedObjective = c.objective as string;

                if (!validObjectives.includes(normalizedObjective)) {
                    if (normalizedObjective === "Balanced") normalizedObjective = "Balance";
                    else if (normalizedObjective === "Growth") normalizedObjective = "Capital Growth";
                    else normalizedObjective = "Balance"; // Default fallback
                }

                setForm((s) => ({
                    ...s,
                    clientName: `${c.firstName} ${c.lastName}`,
                    investmentManager: c.investmentManager ?? s.investmentManager,
                    knowledgeExperience: (c.knowledgeExperience as any) ?? s.knowledgeExperience,
                    capacityOfLoss: `${c.lossPct}%`,
                    accountNumber: c.accountNumber ?? s.accountNumber,
                    salutation: c.salutation ?? s.salutation,
                    objective: normalizedObjective as "Balance" | "Capital Growth" | "Income",
                    risk: (c.risk as any) ?? s.risk,
                }));
            })
            .catch((err) => console.error("Failed to load client details", err));

        return () => {
            cancelled = true;
        };
    }, [form.clientId]);

    /* ------------- trade helpers ------------- */
    const addTrade = () => {
        const newTrade: Trade = {
            assetName: "",
            accountType: "ISA",
            assetType: "Equity",
            assetRisk: "Medium",
            side: "Buy",
            quantity: "",
            timeOfTrade: "",
            dateOfTrade: "",
            reasons: ["", "", ""],
        };

        setForm((prev) => {
            const nextTrades = [...prev.trades, newTrade];
            // update page AFTER state is queued, using nextTrades length
            queueMicrotask(() => setPage(Math.ceil(nextTrades.length / pageSize)));
            return { ...prev, trades: nextTrades };
        });

        // Add corresponding empty errors entry
        setErrors((prev) => ({
            ...prev,
            trades: [...prev.trades, { ...emptyTradeErrors }],
        }));
    };

    const removeTrade = (absIndex: number) => {
        setForm((prev) => {
            const nextTrades = prev.trades.filter((_, i) => i !== absIndex);
            queueMicrotask(() => {
                const nextTotalPages = Math.max(1, Math.ceil(nextTrades.length / pageSize));
                setPage((p) => Math.min(p, nextTotalPages));
            });
            return { ...prev, trades: nextTrades };
        });

        // Remove corresponding errors entry
        setErrors((prev) => ({
            ...prev,
            trades: prev.trades.filter((_, i) => i !== absIndex),
        }));
    };

    /* ------------- validation helper ------------- */
    const validateBeforeSave = (): boolean => {
        const newErrors = validateForm(form);
        setErrors(newErrors);
        setShowErrors(true);

        if (hasErrors(newErrors)) {
            // Find first trade with errors and navigate to it
            const firstTradeWithError = newErrors.trades.findIndex((t) => Object.values(t).some((e) => e !== null));
            if (firstTradeWithError >= 0) {
                setPage(firstTradeWithError + 1);
            }
            return false;
        }

        return true;
    };

    const updateTrade = (absIndex: number, updater: (t: Trade) => Trade) => {
        setForm((prev) => {
            const next = [...prev.trades];
            next[absIndex] = updater(next[absIndex]);
            return { ...prev, trades: next };
        });
    };

    /* ---------------- render ---------------- */
    return (
        <div className="flex-col space-y-2">
            {/* LEFT — Client */}
            <CardClient className="rounded-2xl border p-6 space-y-4 relative">
                <Collapsible open={isOpen}
                             onOpenChange={setIsOpen}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <h1 className="text-base font-medium col-span-2">Client</h1>

                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 absolute right-3 top-4 pt-1">
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>

                    {/* New Client Selector */}
                    <div className="space-y-1.5 ">
                        <Label>Client</Label>
                        <ClientSelector
                            clients={clients}
                            selectedClientId={form.clientId}
                            loading={loadingClients}
                            onSelect={(client) => {
                                setForm((s) => ({ ...s, clientId: client.id }));
                            }}
                        />
                        {showErrors && <FieldError error={errors.client.client} />}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Salutation</Label>
                        <Input
                            className={`bg-input ${showErrors && errors.client.salutation ? "border-red-500" : ""}`}
                            value={form.salutation}
                            onChange={(e) => setForm((s) => ({ ...s, salutation: e.target.value }))}
                            placeholder={`e.g. Jane`}
                        />
                        {showErrors && <FieldError error={errors.client.salutation} />}
                    </div>
                    
                    <CollapsibleContent className="space-y-1.5">
                        <Label>Account Number</Label>
                        <Input
                            className={`bg-input ${showErrors && errors.client.accountNumber ? "border-red-500" : ""}`}
                            value={form.accountNumber}
                            onChange={(e) => setForm((s) => ({ ...s, accountNumber: e.target.value }))}
                            placeholder={`e.g. SCC123456`}
                        />
                        {showErrors && <FieldError error={errors.client.accountNumber} />}
                    </CollapsibleContent>

                    <CollapsibleContent className="space-y-1.5">
                        <Label>Capacity of Loss</Label>
                        <Input
                            className={`bg-input ${showErrors && errors.client.capacityOfLoss ? "border-red-500" : ""}`}
                            value={form.capacityOfLoss}
                            onChange={(e) => setForm((s) => ({ ...s, capacityOfLoss: e.target.value }))}
                            placeholder={`e.g. 50%`}
                        />
                        {showErrors && <FieldError error={errors.client.capacityOfLoss} />}
                    </CollapsibleContent>

                    <CollapsibleContent className="space-y-1.5">
                        <Label>Investment Manager</Label>
                        <Input
                            className={`bg-input ${showErrors && errors.client.investmentManager ? "border-red-500" : ""}`}
                            value={form.investmentManager}
                            onChange={(e) => setForm((s) => ({ ...s, investmentManager: e.target.value }))}
                            placeholder={`e.g. John Smith`}
                        />
                        {showErrors && <FieldError error={errors.client.investmentManager} />}
                    </CollapsibleContent>

                    <CollapsibleContent className="space-y-1.5">
                        <Label>Knowledge / Experience</Label>
                        <Select
                            value={form.knowledgeExperience}
                            onValueChange={(v: any) => setForm((s) => ({ ...s, knowledgeExperience: v }))}
                        >
                            <SelectTrigger className="bg-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </CollapsibleContent>

                    <CollapsibleContent className="space-y-1.5">
                        <Label>Objective</Label>
                        <Select value={form.objective} onValueChange={(v: any) => setForm((s) => ({ ...s, objective: v }))}>
                            <SelectTrigger className="bg-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Balance">Balance</SelectItem>
                                <SelectItem value="Capital Growth">Capital Growth</SelectItem>
                                <SelectItem value="Income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </CollapsibleContent>

                    <CollapsibleContent className="space-y-1.5">
                        <Label>Risk</Label>
                        <Select value={form.risk} onValueChange={(v: any) => setForm((s) => ({ ...s, risk: v }))}>
                            <SelectTrigger
                                className={cn(
                                    "bg-input",
                                    form.risk === "Low" && "bg-emerald-100 text-emerald-900 border-emerald-200 focus:ring-emerald-200",
                                    form.risk === "Medium" && "bg-amber-100 text-amber-900 border-amber-200 focus:ring-amber-200",
                                    form.risk === "High" && "bg-rose-100 text-rose-900 border-rose-200 focus:ring-rose-200"
                                )}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </CollapsibleContent>
                </Collapsible>
            </CardClient>

            {/* RIGHT — Proposed Transactions (1 per page) */}
            <Card className="rounded-2xl border p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">Proposed Transactions</h3>
                    <Button variant="outline" size="sm" onClick={addTrade}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add trade
                    </Button>
                </div>

                <div className="space-y-4">
                    {pagedTrades.map((t, i) => {
                        const abs = startIdx + i;
                        return (
                            <div
                                key={abs}
                                className="rounded-xl border p-4 space-y-4 bg-cardClient text-cardClient-foreground"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Trade {abs + 1}</div>
                                    {form.trades.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeTrade(abs)}
                                            aria-label={`Remove trade ${abs + 1}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Basics */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Asset Name</Label>
                                        <Input
                                            className={`bg-input ${showErrors && errors.trades[abs]?.assetName ? "border-red-500" : ""}`}
                                            value={t.assetName}
                                            onChange={(e) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    assetName: e.target.value,
                                                }))
                                            }
                                            placeholder={`Insert Asset Name...`}
                                        />
                                        {showErrors && <FieldError error={errors.trades[abs]?.assetName} />}
                                    </div>

                                    {/* Radio buttons for the account type */}
                                    <div className="space-y-1.5">
                                        <Label>Account Type</Label>
                                        <RadioGroup
                                            value={t.accountType}
                                            onValueChange={(v: any) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    accountType: v,
                                                }))
                                            }
                                        >
                                            <div className="flex items-center space-x-1.5">
                                                <RadioGroupItem className="bg-input" value="ISA">
                                                    ISA
                                                </RadioGroupItem>
                                                <Label>ISA</Label>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <RadioGroupItem className="bg-input" value="GIA">
                                                    GIA
                                                </RadioGroupItem>
                                                <Label>GIA</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Asset Type</Label>
                                        <RadioGroup
                                            value={t.assetType}
                                            onValueChange={(v: any) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    assetType: v,
                                                }))
                                            }
                                        >
                                            <div className="flex items-center space-x-1.5">
                                                <RadioGroupItem className="bg-input" value="Equity">
                                                    Equity
                                                </RadioGroupItem>
                                                <Label>Equity</Label>
                                            </div>

                                            <div className="flex items-center space-x-1.5">
                                                <RadioGroupItem className="bg-input" value="CFD/SB">
                                                    CFD/SB
                                                </RadioGroupItem>
                                                <Label>CFD/SB</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Asset Risk</Label>
                                        <Select
                                            value={t.assetRisk}
                                            onValueChange={(v: any) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    assetRisk: v,
                                                }))
                                            }
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    "bg-input",
                                                    t.assetRisk === "Low" && "bg-emerald-100 text-emerald-900 border-emerald-200 focus:ring-emerald-200",
                                                    t.assetRisk === "Medium" && "bg-amber-100 text-amber-900 border-amber-200 focus:ring-amber-200",
                                                    t.assetRisk === "High" && "bg-rose-100 text-rose-900 border-rose-200 focus:ring-rose-200"
                                                )}
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Trade Option</Label>
                                        <Select
                                            value={t.side}
                                            onValueChange={(v: any) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    side: v,
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="bg-input">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Buy">Buy</SelectItem>
                                                <SelectItem value="Sell">Sell</SelectItem>
                                                <SelectItem value="Invest">Invest</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>{t.side === "Sell" ? "Quantity" : "Amount"}</Label>
                                        <Input
                                            className={`bg-input ${showErrors && errors.trades[abs]?.quantity ? "border-red-500" : ""}`}
                                            inputMode="numeric"
                                            value={t.quantity}
                                            onChange={(e) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    quantity: e.target.value,
                                                }))
                                            }
                                            placeholder={`e.g. 1000`}
                                        />
                                        {showErrors && <FieldError error={errors.trades[abs]?.quantity} />}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Date of Trade</Label>
                                        <Input
                                            className={`bg-input ${showErrors && errors.trades[abs]?.dateOfTrade ? "border-red-500" : ""}`}
                                            value={t.dateOfTrade}
                                            onChange={(e) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    dateOfTrade: e.target.value,
                                                }))
                                            }
                                            placeholder={`DD/MM/YYYY`}
                                        />
                                        {showErrors && <FieldError error={errors.trades[abs]?.dateOfTrade} />}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Time of Trade</Label>
                                        <Input
                                            className={`bg-input ${showErrors && errors.trades[abs]?.timeOfTrade ? "border-red-500" : ""}`}
                                            value={t.timeOfTrade}
                                            onChange={(e) =>
                                                updateTrade(abs, (old) => ({
                                                    ...old,
                                                    timeOfTrade: e.target.value,
                                                }))
                                            }
                                            placeholder={`HH:MM`}
                                        />
                                        {showErrors && <FieldError error={errors.trades[abs]?.timeOfTrade} />}
                                    </div>
                                </div>

                                {/* Reasons + Calculator */}
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-2">
                                    {/* Rationale Section */}
                                    <div className="lg:col-span-3 space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium">Rationale (this trade)</Label>
                                            {showErrors && <FieldError error={errors.trades[abs]?.reasons} />}
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[0, 1, 2].map((idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground">Reason {idx + 1}</Label>
                                                    <Textarea
                                                        className="min-h-[60px] resize-none bg-input"
                                                        value={t.reasons[idx] ?? ""}
                                                        onChange={(e) =>
                                                            updateTrade(abs, (old) => {
                                                                const reasons = [...old.reasons] as [string, string, string];
                                                                reasons[idx] = e.target.value;
                                                                return { ...old, reasons };
                                                            })
                                                        }
                                                        placeholder={`Enter reason ${idx + 1}...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Calculator Section */}
                                    <div className="lg:col-span-1">
                                        <Card className="h-full">
                                            <div className="p-3">
                                                <Label className="text-sm font-medium">Upside/Downside Calculator</Label>
                                                <UpsideDownsideCalculator />
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination controls (only if >1 trades) */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                            Showing <span className="font-medium">{startIdx + 1}</span> of{" "}
                            <span className="font-medium">{form.trades.length}</span>
                        </div>

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        aria-disabled={page === 1}
                                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {totalPages <= 6 ? (
                                    Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))
                                ) : (
                                    <>
                                        <PaginationItem>
                                            <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        {page > 3 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        {[page - 1, page, page + 1]
                                            .filter((n) => n > 1 && n < totalPages)
                                            .map((n) => (
                                                <PaginationItem key={n}>
                                                    <PaginationLink isActive={page === n} onClick={() => setPage(n)}>
                                                        {n}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                        {page < totalPages - 2 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink isActive={page === totalPages} onClick={() => setPage(totalPages)}>
                                                {totalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        aria-disabled={page === totalPages}
                                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Card>

            {/* ACTIONS — own card spanning both columns */}
            <Card className="lg:col-span-2 rounded-2xl border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        Ready to preview or generate a suitability letter?
                    </div>
                    <div className="flex gap-3">
                        <LetterPreviewSheet form={form} />
                        <Button>
                            <SuitabilityLetterPDF form={form} onBeforeSave={validateBeforeSave} />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}