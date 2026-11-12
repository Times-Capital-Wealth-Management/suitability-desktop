"use client";

import {Database as DbIcon, HistoryIcon, RefreshCw, Search} from "lucide-react";


export default function TradeHistoryTable(){

    return(
        <div className="space-y-4 p-4">
            {/* Header & Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">

                </div>


            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">First Name</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Name</th>
                        <th className="px-1 py-1 text-left font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Asset Name</th>
                        <th className="px-1 py-1 text-left font-medium text-muted-foreground">Trade Option</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reason 1</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reason 2</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reason 3</th>
                    </tr>
                    </thead>

                </table>
            </div>
        </div>
    )

}