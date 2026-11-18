"use client"

import { useState } from "react"
import {EllipsisVertical} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CsvImportHandling, {CsvExportHandling} from "@/components/csv-handling";
import {Input} from "@/components/ui/input";
import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import clientDb from "@/lib/database";
import {toast} from "sonner";

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
type FieldError = string | null

type ClientErrors = {
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

const emptyClientErrors: ClientErrors = {
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

function validateStep1(form: ClientForm): ClientErrors {
    const errors: ClientErrors = { ...emptyClientErrors }

    if (!form.firstName.trim()) errors.firstName = "First name is required"
    if (!form.lastName.trim()) errors.lastName = "Last name is required"
    if (!form.accountNumber.trim()) errors.accountNumber = "Account number is required"
    if (!form.typeAccount) errors.typeAccount = "Account type is required"
    if (!form.investmentManager.trim()) errors.investmentManager = "Investment manager is required"
    if (!form.platform) errors.platform = "Platform is required"

    if (Number.isNaN(form.lossPct) || form.lossPct < 0 || form.lossPct > 100) {
        errors.lossPct = "Must be between 0 and 100"
    } else if (form.typeAccount === "CFD" && form.lossPct !== 100) {
        errors.lossPct = "Capacity of loss must be 100% for CFD"
    }

    if(!form.objective) errors.objective = "Objective is required"
    if(!form.risk) errors.risk = "Risk is required"

    return errors
}

function hasErrors(errors: ClientErrors): boolean {
    return Object.values(errors).some((e) => e !== null)
}

function ErrorText({ error }: { error: FieldError }) {
    if (!error) return null
    return <p className="text-xs text-red-500">{error}</p>
}

function Required() {
    return <span className="text-red-500" aria-hidden="true"> *</span>
}


export default function ClientsOptionsMenu({
                                               onClientCreatedAction,
                                           }: {
    onClientCreatedAction: () => void
}) {

    const EMPTY_FORM: ClientForm = {
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


    const [showNewDialog, setShowNewDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<ClientForm>(EMPTY_FORM)
    const [showErrors, setShowErrors] = useState(false)
    const errors = showErrors ? validateStep1(form) : emptyClientErrors


    const handleCreate = async () => {
        try {
            await clientDb.create({
                firstName: form.firstName,
                lastName: form.lastName,
                investmentManager: form.investmentManager || null,
                platform: form.platform,
                knowledgeExperience: form.knowledgeExperience,
                lossPct: form.lossPct,
                accountNumber: form.accountNumber,
                typeAccount: form.typeAccount,
                salutation: form.salutation || null,
                objective: form.objective,
                risk: form.risk,
                email: form.email || null,
                phone: form.phone || null,
                address: form.address || null,
                powerOfAttorney: form.powerOfAttorney || null,
                annualReviewDate: form.annualReviewDate || null,
                feesCommissionRate: form.feesCommissionRate || null,
            })


            onClientCreatedAction()
            setForm(EMPTY_FORM)
            setShowAddDialog(false)
            setStep(1)

            setTimeout(() => {
                toast.success(`${form.firstName} ${form.lastName} has been added`)
                // fileUtils.messageDialog(
                //     "Success",
                //     `${form.firstName} ${form.lastName} has been added.`,
                //     "info"
                // )
            }, 0)

        } catch (err) {
            setTimeout(() => {
                toast.error(`Failed to add client: ${String(err)}`)
                // fileUtils.messageDialog(
                //     "Error",
                //     "Failed to add client.",
                //     "error"
                // )
            }, 0)
        }
    }



    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" aria-label="Open menu">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setShowAddDialog(true)}>
                            Add Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                            Import/Export
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={showAddDialog} onOpenChange={(open) => {
                setShowAddDialog(open)
                if (!open) {
                    setForm(EMPTY_FORM)
                    setStep(1)
                    setShowErrors(false)
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <form autoComplete="off">
                    <DialogHeader className="mb-3">
                        <DialogTitle>Add Client</DialogTitle>
                        <DialogDescription>
                           Please provide the following details of the client you wish to add. (Fields with * are required.)
                        </DialogDescription>
                    </DialogHeader>

                    {step === 1 && (
                    <FieldSet>
                        <FieldGroup className="grid grid-cols-2 gap-4 pb-3">
                            <Field>
                                <FieldLabel htmlFor="firstname">First Name<Required /></FieldLabel>
                                <Input id="firstname" value={form.firstName}
                                       className={errors.firstName ? "border-red-500" : ""}
                                       onChange={e => setForm({...form, firstName: e.target.value})}
                                       name="firstname" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="surname">Last Name<Required /></FieldLabel>
                                <Input id="surname" value={form.lastName}
                                       className={errors.lastName ? "border-red-500" : ""}
                                       onChange={e => setForm({...form, lastName: e.target.value})}
                                       name="surname" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="accNum">Account Number<Required /></FieldLabel>
                                <Input id="accNum" value={form.accountNumber}
                                       className={errors.accountNumber ? "border-red-500" : ""}
                                       onChange={e => setForm({...form, accountNumber: e.target.value})}
                                       name="accNum" />
                            </Field>

                            <Field>
                                <FieldLabel>Account Type<Required /></FieldLabel>
                                <Select value={form.typeAccount}
                                        onValueChange={value => setForm({
                                            ...form,
                                            typeAccount: value,
                                            lossPct: value === "CFD" ? 100 : form.lossPct,
                                        })}>
                                    <SelectTrigger className={errors.typeAccount ? "border-red-500" : ""}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ISA">ISA</SelectItem>
                                        <SelectItem value="GIA">GIA</SelectItem>
                                        <SelectItem value="CFD">CFD</SelectItem>
                                        <SelectItem value="Spread Bet">Spread Bet</SelectItem>
                                        <SelectItem value="JISA">JISA</SelectItem>
                                        <SelectItem value="Corporate">Corporate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="investmanager">Investment Manager <Required /></FieldLabel>
                                <Input id="investmanager" value={form.investmentManager}
                                       className={errors.investmentManager ? "border-red-500" : ""}
                                       onChange={e => setForm({...form, investmentManager: e.target.value})}
                                       name="investmanager" />
                            </Field>

                            <Field>
                                <FieldLabel>Investment Platform<Required /></FieldLabel>
                                <Select value={form.platform}
                                        onValueChange={value => setForm({...form, platform: value})}>
                                    <SelectTrigger className={errors.platform ? "border-red-500" : ""}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AJ Bell">AJ Bell</SelectItem>
                                        <SelectItem value="Spreadex">Spreadex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="lossPct">Capacity of Loss<Required /></FieldLabel>
                                <Input id="lossPct" value={form.lossPct}
                                       inputMode="numeric"
                                       className={errors.lossPct ? "border-red-500" : ""}
                                       onChange={e => setForm({...form, lossPct: Number(e.target.value)})}
                                       name="lossPct" />
                                <ErrorText error={errors.lossPct} />
                            </Field>

                        <Field>
                            <FieldLabel>Objective<Required /></FieldLabel>
                            <Select value={form.objective}
                                    onValueChange={value => setForm({...form, objective: value})}>
                                <SelectTrigger className={errors.objective ? "border-red-500" : ""}>
                                    <SelectValue />
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
                            <Select value={form.risk}
                                    onValueChange={value => setForm({...form, risk: value})}>
                                <SelectTrigger className={errors.risk ? "border-red-500" : ""}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button type="button" onClick={() => {
                                setShowErrors(true)
                                if (!hasErrors(validateStep1(form))) {
                                    setShowErrors(false)
                                    setStep(2)
                                }
                            }}>
                                Next
                            </Button>
                        </DialogFooter>
                    </FieldSet>
                    )}


                    {step === 2 && (
                        <FieldSet>
                            <FieldGroup className="grid grid-cols-2 gap-4 pb-3">
                                <Field>
                                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                    <Input id="phone" value={form.phone}
                                           onChange={e => setForm({...form, phone: e.target.value})}
                                           autoComplete="new-phone"
                                           autoCorrect="off"
                                           name="phone"/>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    <Input id="email" value={form.email}
                                           onChange={e => setForm({...form, email: e.target.value})}
                                           autoComplete="new-email"
                                           autoCorrect="off"
                                           name="email"  />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="address">Address</FieldLabel>
                                    <Input id="address" value={form.address}
                                           onChange={e => setForm({...form, address: e.target.value})}
                                           autoComplete="new-address"
                                           autoCorrect="off"
                                           name="address" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="powerofattorney">Power of Attorney</FieldLabel>
                                    <Input id="powerofattorney" value={form.powerOfAttorney}
                                           onChange={e => setForm({...form, powerOfAttorney: e.target.value})}
                                           autoComplete="new-powerofattorney"
                                           autoCorrect="off"
                                           name="powerofattorney"/>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="annualreviewdate">Annual Review Date</FieldLabel>
                                    <Input id="annualreviewdate" value={form.annualReviewDate}
                                           onChange={e => setForm({...form, annualReviewDate: e.target.value})}
                                           autoComplete="new-annualreviewdate"
                                           autoCorrect="off"
                                           name="annualreviewdate"  />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="feescommission">Fees/Commission Rate</FieldLabel>
                                    <Input id="feescommission" value={form.feesCommissionRate}
                                           onChange={e => setForm({...form, feesCommissionRate: e.target.value})}
                                           autoComplete="new-feescommission"
                                           autoCorrect="off"
                                           name="feescommission"  />
                                </Field>
                            </FieldGroup>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button type="button" onClick={() => void handleCreate()}>Create</Button>
                            </DialogFooter>
                        </FieldSet>
                    )}
                    </form>


                </DialogContent>
            </Dialog>
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>
                        <DialogDescription>
                           Would you like to import or export?
                        </DialogDescription>
                    </DialogTitle>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"> Cancel </Button>
                        </DialogClose>
                        <CsvExportHandling/>
                        <CsvImportHandling/>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
