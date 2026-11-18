"use client"

import type { Dispatch, SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    ACCOUNT_TYPES,
    type ClientErrors,
    type ClientForm,
    type FieldError,
} from "@/lib/client-validation"

export function ErrorText({ error }: { error: FieldError }) {
    if (!error) return null
    return <p className="text-xs text-red-500">{error}</p>
}

export function Required() {
    return <span className="text-red-500" aria-hidden="true"> *</span>
}

const STEP2_FIELDS = [
    ["phone", "Phone Number"],
    ["email", "Email Address"],
    ["address", "Address"],
    ["powerOfAttorney", "Power of Attorney"],
    ["annualReviewDate", "Annual Review Date"],
    ["feesCommissionRate", "Fees/Commission Rate"],
] as const

export default function ClientFormFields({
                                             form,
                                             setForm,
                                             errors,
                                             step,
                                         }: {
    form: ClientForm
    setForm: Dispatch<SetStateAction<ClientForm>>
    errors: ClientErrors
    step: number
}) {
    const set = <K extends keyof ClientForm>(key: K, value: ClientForm[K]) =>
        setForm((f) => ({ ...f, [key]: value }))
    const red = (e: FieldError) => (e ? "border-red-500" : "")

    if (step === 2) {
        return (
            <FieldSet>
                <FieldGroup className="grid grid-cols-2 gap-4 pb-3">
                    {STEP2_FIELDS.map(([key, label]) => (
                        <Field key={key}>
                            <FieldLabel htmlFor={key}>{label}</FieldLabel>
                            <Input
                                id={key}
                                name={key}
                                value={form[key]}
                                autoComplete={`new-${key}`}
                                autoCorrect="off"
                                onChange={(e) => set(key, e.target.value)}
                            />
                        </Field>
                    ))}
                </FieldGroup>
            </FieldSet>
        )
    }

    return (
        <FieldSet>
            <FieldGroup className="grid grid-cols-2 gap-4 pb-3">
                <Field>
                    <FieldLabel htmlFor="firstName">First Name<Required /></FieldLabel>
                    <Input id="firstName" value={form.firstName} className={red(errors.firstName)}
                           onChange={(e) => set("firstName", e.target.value)} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="lastName">Last Name<Required /></FieldLabel>
                    <Input id="lastName" value={form.lastName} className={red(errors.lastName)}
                           onChange={(e) => set("lastName", e.target.value)} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="salutation">Salutation</FieldLabel>
                    <Input id="salutation" value={form.salutation}
                           onChange={(e) => set("salutation", e.target.value)} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="accountNumber">Account Number<Required /></FieldLabel>
                    <Input id="accountNumber" value={form.accountNumber} className={red(errors.accountNumber)}
                           onChange={(e) => set("accountNumber", e.target.value)} />
                </Field>

                <Field>
                    <FieldLabel>Account Type<Required /></FieldLabel>
                    <Select
                        value={form.typeAccount}
                        onValueChange={(value) =>
                            setForm((f) => ({
                                ...f,
                                typeAccount: value,
                                lossPct: value === "CFD" ? 100 : f.lossPct,
                            }))
                        }
                    >
                        <SelectTrigger className={red(errors.typeAccount)}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {ACCOUNT_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel htmlFor="investmentManager">Investment Manager<Required /></FieldLabel>
                    <Input id="investmentManager" value={form.investmentManager}
                           className={red(errors.investmentManager)}
                           onChange={(e) => set("investmentManager", e.target.value)} />
                </Field>

                <Field>
                    <FieldLabel>Investment Platform<Required /></FieldLabel>
                    <Select value={form.platform} onValueChange={(v) => set("platform", v)}>
                        <SelectTrigger className={red(errors.platform)}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AJ Bell">AJ Bell</SelectItem>
                            <SelectItem value="Spreadex">Spreadex</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel htmlFor="lossPct">Capacity of Loss<Required /></FieldLabel>
                    <Input id="lossPct" value={form.lossPct} inputMode="numeric"
                           className={red(errors.lossPct)}
                           onChange={(e) => set("lossPct", Number(e.target.value))} />
                    <ErrorText error={errors.lossPct} />
                </Field>

                <Field>
                    <FieldLabel>Objective<Required /></FieldLabel>
                    <Select value={form.objective} onValueChange={(v) => set("objective", v)}>
                        <SelectTrigger className={red(errors.objective)}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Capital Growth">Capital Growth</SelectItem>
                            <SelectItem value="Balance">Balance</SelectItem>
                            <SelectItem value="Income">Income</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel>Risk<Required /></FieldLabel>
                    <Select value={form.risk} onValueChange={(v) => set("risk", v)}>
                        <SelectTrigger className={red(errors.risk)}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}