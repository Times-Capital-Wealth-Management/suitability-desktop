"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {User, Mail, Home, Hash, Phone, CalendarClock, BadgePercent, Scale} from "lucide-react";
import { useClient } from "@/hooks/use-tauri";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
};

export default function ClientDetailsSheet({
  clientId,
  trigger,
}: {
  clientId: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { client, loading } = useClient(open ? clientId : null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[520px] pt-12 sm:pt-14">
        <SheetHeader className="sr-only">
          <SheetTitle>Client details</SheetTitle>
          <SheetDescription>Client details</SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="mx-auto w-full max-w-md space-y-3 p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : client ? (
          <div className="mx-auto w-full max-w-md p-4">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <dl className="divide-y">
                {/* Name */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Name
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.firstName} {client.lastName}
                    </dd>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Phone
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.phone ?? "—"}
                    </dd>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Email
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.email ?? "—"}
                    </dd>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Address
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.address ?? "—"}
                    </dd>
                  </div>
                </div>

                {/* Account Number */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Account Number
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.accountNumber}
                    </dd>
                  </div>
                </div>


                {/* Power of Attorney */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Power of Attorney
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.powerOfAttorney ?? "N/A"}
                    </dd>
                  </div>
                </div>

                {/* Annual Review Date */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Annual Review Date
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.annualReviewDate ?? "N/A"}
                    </dd>
                  </div>
                </div>

                {/* Fees/Commission Rate */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <BadgePercent className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Fees/Commission Rate
                    </dt>
                    <dd className="text-sm font-medium">
                      {client.feesCommissionRate ?? "N/A"}
                    </dd>
                  </div>
                </div>

              </dl>
            </div>

            <div className="mt-5">
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl text-sm"
                  >
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md p-4 text-sm text-muted-foreground">
            Unable to fetch client information.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
