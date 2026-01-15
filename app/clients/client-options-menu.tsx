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

export default function ClientsOptionsMenu() {
    const [showNewDialog, setShowNewDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [step, setStep] = useState(1)

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
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog} >
                <DialogContent className="sm:max-w-[425px]">
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
                            <Input id="firstname" name="firstname" placeholder="e.g. John" required />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="surname">Last Name</FieldLabel>
                            <Input id="surname" name="surname" placeholder="e.g. Smith" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="accNum">Account Number</FieldLabel>
                            <Input id="accNum" name="accNum" placeholder="e.g. SCC123456" />
                        </Field>

                        <Field>
                            <FieldLabel>Account Type</FieldLabel>
                            <Select>
                                <SelectTrigger>
                                <SelectValue placeholder="Select Type..."/>
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
                            <Input id="investmanager" name="investmanager" placeholder="e.g. John Doe" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lossPct">Capacity of Loss</FieldLabel>
                            <Input id="lossPct" name="lossPct" placeholder="e.g. 50%" />
                        </Field>

                        <Field>
                            <FieldLabel>Objective</FieldLabel>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Objective... "/>
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
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Risk..."/>
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
                                    <Input id="phone" name="phone" placeholder="e.g. 07123456789" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    <Input id="email" name="email" placeholder="e.g. john@mail.com" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="address">Address</FieldLabel>
                                    <Input id="address" name="address" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="powerofattorney">Power of Attorney</FieldLabel>
                                    <Input id="powerofattorney" name="powerofattorney"/>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="annualreviewdate">Annual Review Date</FieldLabel>
                                    <Input id="annualreviewdate" name="annualreviewdate" placeholder="e.g. 12/12/2026" />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="feescommission">Fees/Commission Rate</FieldLabel>
                                    <Input id="feescommission" name="feescommission" placeholder="e.g. 1%" />
                                </Field>
                            </FieldGroup>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </FieldSet>
                    )}


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
