// Unified data provider that works in both browser and Tauri
import { isTauri } from "./tauri";
import { clientDb, type Client, type ClientList } from "./database";

// Client data provider
export const clientProvider = {
  // Get all clients
  async getAll(): Promise<ClientList> {
    if (isTauri()) {
      try {
        // Return whatever is in the DB (managed via Settings > Import)
        return await clientDb.getAll();
      } catch (error) {
        console.error("Database error, returning empty list:", error);
        return { items: [], total: 0 };
      }
    }

    // Browser: use API or empty
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API not available
    }

    return { items: [], total: 0 };
  },

  // Get single client by ID
  async getById(id: string): Promise<Client | null> {
    if (isTauri()) {
      try {
        return await clientDb.getById(id);
      } catch (error) {
        console.error("Database error:", error);
      }
    }

    // Browser: use API
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API not available
    }

    return null;
  },

  // Search clients
  async search(query: string): Promise<ClientList> {
    if (isTauri()) {
      try {
        return await clientDb.search(query);
      } catch (error) {
        console.error("Database error:", error);
      }
    }

    return { items: [], total: 0 };
  },

  // Create new client (desktop only)
  async create(client: Omit<Client, "id">): Promise<Client | null> {
    if (isTauri()) {
      try {
        return await clientDb.create(client);
      } catch (error) {
        console.error("Failed to create client:", error);
      }
    }
    return null;
  },

  // Update existing client (desktop only)
  async update(id: string, client: Partial<Client>): Promise<boolean> {
    if (isTauri()) {
      try {
        return await clientDb.update(id, client);
      } catch (error) {
        console.error("Failed to update client:", error);
      }
    }
    return false;
  },

  // Delete client (desktop only)
  async delete(id: string): Promise<boolean> {
    if (isTauri()) {
      try {
        return await clientDb.delete(id);
      } catch (error) {
        console.error("Failed to delete client:", error);
      }
    }
    return false;
  },
};

export default clientProvider;