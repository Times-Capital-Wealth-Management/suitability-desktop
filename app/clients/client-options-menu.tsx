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
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function ClientsOptionsMenu() {
    const [showNewDialog, setShowNewDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)

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
                    <FieldGroup className="grid grid-cols-2 gap-4 pb-3">
                        <Field>
                            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                            <Input id="firstname" name="firstname" placeholder="e.g. John" />
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
                            <Input id="lossPct" name="CapacityLoss" placeholder="e.g. 50%" />
                        </Field>

                        <Field>
                            <FieldLabel>Objective</FieldLabel>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Objective... "/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="engineering">Capital Growth</SelectItem>
                                    <SelectItem value="design">Balanced</SelectItem>
                                    <SelectItem value="marketing">Income</SelectItem>
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
                                    <SelectItem value="engineering">Low</SelectItem>
                                    <SelectItem value="design">Medium</SelectItem>
                                    <SelectItem value="marketing">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
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
