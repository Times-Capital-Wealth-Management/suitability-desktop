import type { Client } from "@/lib/database"

export const ACCOUNT_TYPES = [
    "ISA", "GIA", "CFD", "Spread Bet", "JISA", "SIPP", "Corporate",
] as const

export type ClientForm = {
    firstName: string
    lastName: string
    investmentManager: string
    platform: string
    knowledgeExperience: string
    lossPct: number
    accountNumber: string
    typeAccount: string
    salutation: string
    objective: string
    risk: string
    email: string
    phone: string
    address: string
    powerOfAttorney: string
    annualReviewDate: string
    feesCommissionRate: string
}

export const EMPTY_FORM: ClientForm = {
    firstName: "",
    lastName: "",
    investmentManager: "",
    platform: "",
    knowledgeExperience: "Medium",
    lossPct: 0,
    accountNumber: "",
    typeAccount: "",
    salutation: "",
    objective: "",
    risk: "",
    email: "",
    phone: "",
    address: "",
    powerOfAttorney: "",
    annualReviewDate: "",
    feesCommissionRate: "",
}

export type FieldError = string | null

export type ClientErrors = {
    firstName: FieldError
    lastName: FieldError
    accountNumber: FieldError
    typeAccount: FieldError
    investmentManager: FieldError
    platform: FieldError
    lossPct: FieldError
    objective: FieldError
    risk: FieldError
}

export const emptyClientErrors: ClientErrors = {
    firstName: null,
    lastName: null,
    accountNumber: null,
    typeAccount: null,
    investmentManager: null,
    platform: null,
    lossPct: null,
    objective: null,
    risk: null,
}

export function validateStep1(form: ClientForm): ClientErrors {
    const errors: ClientErrors = { ...emptyClientErrors }

    if (!form.firstName.trim()) errors.firstName = "First name is required"
    if (!form.lastName.trim()) errors.lastName = "Last name is required"
    if (!form.accountNumber.trim()) errors.accountNumber = "Account number is required"
    if (!(ACCOUNT_TYPES as readonly string[]).includes(form.typeAccount))
        errors.typeAccount = "Account type is required"
    if (!form.investmentManager.trim()) errors.investmentManager = "Investment manager is required"
    if (!form.platform) errors.platform = "Platform is required"

    if (Number.isNaN(form.lossPct) || form.lossPct < 0 || form.lossPct > 100) {
        errors.lossPct = "Must be between 0 and 100"
    } else if (form.typeAccount === "CFD" && form.lossPct !== 100) {
        errors.lossPct = "Capacity of loss must be 100% for CFD"
    }

    if (!form.objective) errors.objective = "Objective is required"
    if (!form.risk) errors.risk = "Risk is required"

    return errors
}

export function hasErrors(errors: ClientErrors): boolean {
    return Object.values(errors).some((e) => e !== null)
}

// Database client -> form (used by Edit)
export function clientToForm(c: Client): ClientForm {
    return {
        firstName: c.firstName,
        lastName: c.lastName,
        investmentManager: c.investmentManager ?? "",
        platform: c.platform ?? "",
        knowledgeExperience: c.knowledgeExperience,
        lossPct: c.lossPct,
        accountNumber: c.accountNumber,
        // Old rows can be null or "Other"; blank means "pick one" with a red border
        typeAccount: (ACCOUNT_TYPES as readonly string[]).includes(c.typeAccount)
            ? c.typeAccount
            : "",
        salutation: c.salutation ?? "",
        objective: c.objective === "Balanced" ? "Balance" : c.objective,
        risk: c.risk,
        email: c.email ?? "",
        phone: c.phone ?? "",
        address: c.address ?? "",
        powerOfAttorney: c.powerOfAttorney ?? "",
        annualReviewDate: c.annualReviewDate ?? "",
        feesCommissionRate: c.feesCommissionRate ?? "",
    }
}

// Form -> database fields (used by both Add and Edit). Blank becomes null.
export function formToClientFields(f: ClientForm): Omit<Client, "id"> {
    return {
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        investmentManager: f.investmentManager.trim() || null,
        platform: f.platform,
        knowledgeExperience: f.knowledgeExperience,
        lossPct: f.lossPct,
        accountNumber: f.accountNumber.trim(),
        typeAccount: f.typeAccount,
        salutation: f.salutation || null,
        objective: f.objective,
        risk: f.risk,
        email: f.email || null,
        phone: f.phone || null,
        address: f.address || null,
        powerOfAttorney: f.powerOfAttorney || null,
        annualReviewDate: f.annualReviewDate || null,
        feesCommissionRate: f.feesCommissionRate || null,
    }
}