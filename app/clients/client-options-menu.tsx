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
import CsvImportHandling from "@/components/csv-handling";

export default function ClientsOptionsMenu() {
    const [showNewDialog, setShowNewDialog] = useState(false)
    const [showShareDialog, setShowShareDialog] = useState(false)

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
                        <DropdownMenuItem>
                            Add Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                            Import/Export
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
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
                        <Button variant="outline" disabled> Export CSV </Button>
                        <CsvImportHandling/>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
