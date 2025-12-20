"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import ClientDetailsSheet from "@/components/clients/client-details-sheet";
import { ChevronRight, RefreshCw, Search, Database as DbIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientProvider } from "@/lib/data-provider";
import { type Client } from "@/lib/database";

// ---------- UI Components ----------
function RiskBadge({ risk }: { risk: string }) {
  const tone =
      risk === "Low"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : risk === "Medium"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-rose-50 text-rose-700 border-rose-200";
  return (
      <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${tone}`}
      >
      {risk}
    </span>
  );
}

function TableSkeleton() {
  return (
      <div className="space-y-4">
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
            <tr>
              <th className="w-12 px-2 py-2">Details</th>
              <th className="px-3 py-2 text-left">First Name</th>
              <th className="px-3 py-2 text-left">Last Name</th>
              <th className="px-3 py-2 text-left">Account Number</th>
              <th className="px-3 py-2 text-left">Manager</th>
              <th className="px-3 py-2 text-left">Risk</th>
            </tr>
            </thead>
            <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-2"><Skeleton className="h-8 w-8" /></td>
                  <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-3 py-2"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-3 py-2"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-3 py-2"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-3 py-2"><Skeleton className="h-6 w-16" /></td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

// ---------- Main Page ----------
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch clients via the Provider
  const fetchClients = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      // Use the provider instead of raw SQL
      // This handles seeding, mock data fallback, and the DB connection
      const result = await clientProvider.search(query);

      // Map the provider's result to our local state
      // (The provider returns { items: Client[], total: number })
      setClients(result.items as Client[]);
    } catch (err) {
      console.error("Failed to load clients:", err);
      setError("Failed to load clients data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load & Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients(searchQuery);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
      <div className="space-y-4 p-4">
        {/* Header & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DbIcon className="h-4 w-4" />
            <span>Client Database</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="Search clients..."
                  className="pl-8 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => fetchClients(searchQuery)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {error}
            </div>
        )}

        {/* Loading State */}
        {loading ? (
            <TableSkeleton />
        ) : (
            /* Data Table */
            <div className="rounded-2xl border overflow-hidden bg-card">
              {clients.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No clients found.
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30">
                      <tr>
                        <th className="w-12 px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">First Name</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Name</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Account</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Manager</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">% Loss</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Objective</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risk</th>
                      </tr>
                      </thead>

                      <tbody className="divide-y">
                      {clients.map((c) => (
                          <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                            {/* Details Trigger */}
                            <td className="px-4 py-3">
                              <ClientDetailsSheet
                                  clientId={c.id}
                                  trigger={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  }
                              />
                            </td>

                            <td className="px-4 py-3 font-medium">{c.firstName}</td>
                            <td className="px-4 py-3 font-medium">{c.lastName}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.accountNumber}</td>
                            <td className="px-4 py-3">{c.investmentManager ?? "—"}</td>
                            <td className="px-4 py-3">{c.lossPct}%</td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary" className="font-normal text-xs">
                                {c.objective}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <RiskBadge risk={c.risk} />
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
        )}

        <div className="text-xs text-muted-foreground text-right">
          Showing {clients.length} results
        </div>
      </div>
  );
}