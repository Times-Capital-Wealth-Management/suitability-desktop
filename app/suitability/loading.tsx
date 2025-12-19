// app/Suitability/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6 p-6">
            <h2 className="text-2xl font-semibold">Suitability</h2>

            <section className="rounded-2xl border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-6 space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <div className="rounded-2xl border p-6 space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </section>
        </div>
    );
}
