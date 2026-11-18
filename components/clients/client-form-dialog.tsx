"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import ClientFormFields, { Required } from "@/components/clients/client-form-fields"
import {
    type ClientForm, emptyClientErrors, hasErrors, validateStep1,
} from "@/lib/client-validation"

export default function ClientFormDialog({
                                             title,
                                             initialForm,
                                             submitLabel,
                                             onSubmit,
                                             onClose,
                                         }: {
    title: string
    initialForm: ClientForm
    submitLabel: string
    onSubmit: (form: ClientForm) => Promise<void> // throw to signal failure
    onClose: () => void
}) {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<ClientForm>(initialForm)
    const [showErrors, setShowErrors] = useState(false)
    const [saving, setSaving] = useState(false)
    const errors = showErrors ? validateStep1(form) : emptyClientErrors

    const handleNext = () => {
        setShowErrors(true)
        if (!hasErrors(validateStep1(form))) {
            setShowErrors(false)
            setStep(2)
        }
    }

    const handleSubmit = async () => {
        setSaving(true)
        try {
            await onSubmit(form)
            onClose()
        } catch (err) {
            toast.error(`Failed to save client: ${String(err)}`)
            setSaving(false)
        }
    }

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="sm:max-w-[425px]">
                <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                    <DialogHeader className="mb-3">
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Please provide the details below. (Fields with <Required /> are required.)
                        </DialogDescription>
                    </DialogHeader>

                    <ClientFormFields form={form} setForm={setForm} errors={errors} step={step} />

                    <DialogFooter>
                        {step === 1 ? (
                            <>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleNext}>Next</Button>
                            </>
                        ) : (
                            <>
                                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button type="button" disabled={saving} onClick={() => void handleSubmit()}>
                                    {submitLabel}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}