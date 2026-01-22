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
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CsvImportHandling, {CsvExportHandling} from "@/components/csv-handling";
import {Input} from "@/components/ui/input";
import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import clientDb from "@/lib/database";
import fileUtils from "@/lib/file-utils";

export type ClientForm = {
    firstName: string
    lastName: string
    investmentManager: string
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


export default function ClientsOptionsMenu({
                                               onClientCreatedAction,
                                           }: {
    onClientCreatedAction: () => void
}) {

    const EMPTY_FORM: ClientForm = {
        firstName: "",
        lastName: "",
        investmentManager: "",
        knowledgeExperience: "Medium",
        lossPct: 0,
        accountNumber: "",
        typeAccount: "",
        salutation: "",
        objective: "Balance",
        risk: "Medium",
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


    const handleCreate = async () => {
        try {
            await clientDb.create({
                firstName: form.firstName,
                lastName: form.lastName,
                investmentManager: form.investmentManager || null,
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
                fileUtils.messageDialog(
                    "Success",
                    `${form.firstName} ${form.lastName} has been added.`,
                    "info"
                )
            }, 0)

        } catch (err) {
            setTimeout(() => {
                fileUtils.messageDialog(
                    "Error",
                    "Failed to add client.",
                    "error"
                )
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
            <Dialog open={showAddDialog} onOpenChange={(open) => {setShowAddDialog(open)
            if (!open){
                setForm(EMPTY_FORM)
                setStep(1)
            }}}>
                <DialogContent className="sm:max-w-[425px]">
                    <form autoComplete="off">
                    <DialogHeader>
                        <DialogTitle>Add Client</DialogTitle>
                        <DialogDescription>
                           Please provide the following details of the client you wish to add.
                        </DialogDescription>
                    </DialogHeader>

                    {step === 1 && (
                    <FieldSet>
                    <FieldGroup className="grid grid-cols-2 gap-4 pb-3">
                        <Field>
                            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                            <Input id="firstname" value={form.firstName}
                                   onChange={e => setForm({...form, firstName: e.target.value})}
                                   name="firstname" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="surname">Last Name</FieldLabel>
                            <Input id="surname" value={form.lastName}
                                   onChange={e => setForm({...form, lastName: e.target.value})}
                                   name="surname" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="accNum">Account Number</FieldLabel>
                            <Input id="accNum" value={form.accountNumber}
                                   onChange={e => setForm({...form, accountNumber: e.target.value})}
                                   name="accNum"  />
                        </Field>

                        <Field>
                            <FieldLabel>Account Type</FieldLabel>
                            <Select value={form.typeAccount}
                                    onValueChange={value => setForm({...form, typeAccount: value})}>
                                <SelectTrigger>
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ISA">ISA</SelectItem>
                                    <SelectItem value="GIA">GIA</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="investmanager">Investment Manager</FieldLabel>
                            <Input id="investmanager" value={form.investmentManager}
                                   onChange={e => setForm({...form, investmentManager: e.target.value})}
                                   name="investmanager" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lossPct">Capacity of Loss</FieldLabel>
                            <Input id="lossPct" value={form.lossPct}
                                   onChange={e => setForm({...form, lossPct: Number(e.target.value)})}
                                   name="lossPct"  />
                        </Field>

                        <Field>
                            <FieldLabel>Objective</FieldLabel>
                            <Select value={form.objective}
                                    onValueChange={value => setForm({...form, objective: value})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="capitalgrowth">Capital Growth</SelectItem>
                                    <SelectItem value="balanced">Balanced</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>Risk</FieldLabel>
                            <Select value={form.risk}
                                    onValueChange={value => setForm({...form, risk: value})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button type="button" onClick={() => setStep(2)}>
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
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={() => void handleCreate()}>Create</Button>
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
