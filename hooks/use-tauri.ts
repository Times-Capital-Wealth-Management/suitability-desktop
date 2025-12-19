"use client";

import { useEffect, useState, useCallback } from "react";
import { isTauri } from "@/lib/tauri";
import { clientProvider } from "@/lib/data-provider";
import type { Client, ClientList } from "@/lib/database";

/**
 * Hook to detect if the app is running in Tauri (desktop) or browser
 */
export function useTauri() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsDesktop(isTauri());
    setIsLoading(false);
  }, []);

  return { isDesktop, isLoading };
}

/**
 * Hook to get the app version from Tauri
 */
export function useAppVersion() {
  const [version, setVersion] = useState<string | null>(null);
  const { isDesktop } = useTauri();

  useEffect(() => {
    if (!isDesktop) return;

    const getVersion = async () => {
      try {
        const { tauriCommands } = await import("@/lib/tauri");
        const v = await tauriCommands.getAppVersion();
        setVersion(v);
      } catch (error) {
        console.error("Failed to get app version:", error);
      }
    };

    getVersion();
  }, [isDesktop]);

  return version;
}

/**
 * Hook to fetch all clients
 */
export function useClients() {
  const [data, setData] = useState<ClientList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clients = await clientProvider.getAll();
      setData(clients);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

/**
 * Hook to fetch a single client by ID
 */
export function useClient(id: string | null) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setClient(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    clientProvider
      .getById(id)
      .then((data) => {
        if (!cancelled) setClient(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load client");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { client, loading, error };
}

/**
 * Hook to search clients
 */
export function useClientSearch(query: string) {
  const [results, setResults] = useState<ClientList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const debounce = setTimeout(async () => {
      try {
        const data = await clientProvider.search(query);
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setResults(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [query]);

  return { results, loading };
}
