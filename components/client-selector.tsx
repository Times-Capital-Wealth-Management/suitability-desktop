"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { type Client } from "@/lib/database"; // Uses your shared Client type

interface ClientSelectorProps {
    clients: Client[];
    selectedClientId?: string | null;
    onSelect: (client: Client) => void;
    loading?: boolean;
}

export function ClientSelector({ clients, selectedClientId, onSelect, loading }: ClientSelectorProps) {
    const [open, setOpen] = React.useState(false);

    // Find selected client for display
    const selectedClient = clients.find((c) => c.id === selectedClientId);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-background px-3 font-normal"
                >
                    {selectedClient ? (
                        <span className="font-medium truncate">
              {selectedClient.firstName} {selectedClient.lastName}
            </span>
                    ) : (
                        <span className="text-muted-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
                            {loading ? "Loading clients..." : "Search client..."}
            </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search name..." />
                    <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={`${client.firstName} ${client.lastName}`}
                                    onSelect={() => {
                                        onSelect(client);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedClientId === client.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                    <span className="font-medium">
                      {client.firstName} {client.lastName}
                    </span>
                                        <span className="text-xs text-muted-foreground">
                      {client.accountNumber} • {client.typeAccount}
                    </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}