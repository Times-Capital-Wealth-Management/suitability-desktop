// Unified data provider that works in both browser and Tauri
import { isTauri } from "./tauri";
import { clientDb, type Client, type ClientList } from "./database";

// Import mock data for fallback/seeding
import { MOCK_CLIENTS } from "@/app/clients/data";

// Client data provider
export const clientProvider = {
  // Get all clients
  async getAll(): Promise<ClientList> {
    if (isTauri()) {
      try {
        // Try to seed database on first run
        await clientDb.seed(MOCK_CLIENTS.items as Client[]);
        return await clientDb.getAll();
      } catch (error) {
        console.error("Database error, falling back to mock data:", error);
        return MOCK_CLIENTS as ClientList;
      }
    }
    
    // Browser: use API or mock data
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API not available
    }
    
    return MOCK_CLIENTS as ClientList;
  },

  // Get single client
  async getById(id: string): Promise<Client | null> {
    if (isTauri()) {
      try {
        return await clientDb.getById(id);
      } catch (error) {
        console.error("Database error:", error);
      }
    }
    
    // Browser: use API or mock data
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API not available
    }
    
    // Fallback to mock data
    const client = MOCK_CLIENTS.items.find((c) => c.id === id);
    return client as Client || null;
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
    
    // Fallback: filter mock data
    const items = MOCK_CLIENTS.items.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
    return { items: items as Client[], total: items.length };
  },

  // Create client (desktop only for now)
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

  // Update client (desktop only for now)
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

  // Delete client (desktop only for now)
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
