// Database service for SQLite operations via Tauri
import { isTauri } from "./tauri";

// Types
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  investmentManager?: string | null;
  knowledgeExperience: string;
  lossPct: number;
  accountNumber: string;
  salutation?: string | null;
  objective: string;
  risk: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type ClientList = { items: Client[]; total: number };

// Database row type (snake_case from SQLite)
type ClientRow = {
  id: string;
  first_name: string;
  last_name: string;
  investment_manager: string | null;
  knowledge_experience: string;
  loss_pct: number;
  account_number: string;
  salutation: string | null;
  objective: string;
  risk: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

// Convert database row to Client type
function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    investmentManager: row.investment_manager,
    knowledgeExperience: row.knowledge_experience,
    lossPct: row.loss_pct,
    accountNumber: row.account_number,
    salutation: row.salutation,
    objective: row.objective,
    risk: row.risk,
    email: row.email,
    phone: row.phone,
    address: row.address,
  };
}

// Database connection singleton
let db: Awaited<ReturnType<typeof import("@tauri-apps/plugin-sql").default.load>> | null = null;

async function getDb() {
  if (!isTauri()) {
    throw new Error("Database only available in Tauri environment");
  }

  if (!db) {
    const Database = (await import("@tauri-apps/plugin-sql")).default;
    db = await Database.load("sqlite:timescapital.db");
  }

  return db;
}

// Client CRUD operations
export const clientDb = {
  // Get all clients
  async getAll(): Promise<ClientList> {
    const database = await getDb();
    const rows = await database.select<ClientRow[]>(
        "SELECT * FROM clients ORDER BY last_name, first_name"
    );
    const items = rows.map(rowToClient);
    return { items, total: items.length };
  },

  // Get single client by ID
  async getById(id: string): Promise<Client | null> {
    const database = await getDb();
    const rows = await database.select<ClientRow[]>(
        "SELECT * FROM clients WHERE id = ?",
        [id]
    );
    return rows.length > 0 ? rowToClient(rows[0]) : null;
  },

  // Search clients by name
  async search(query: string): Promise<ClientList> {
    const database = await getDb();
    const searchTerm = `%${query}%`;
    const rows = await database.select<ClientRow[]>(
        `SELECT * FROM clients 
       WHERE first_name LIKE ? OR last_name LIKE ? 
       ORDER BY last_name, first_name`,
        [searchTerm, searchTerm]
    );
    const items = rows.map(rowToClient);
    return { items, total: items.length };
  },

  // Create new client
  async create(client: Omit<Client, "id">): Promise<Client> {
    const database = await getDb();
    const id = `c${Date.now()}`;

    await database.execute(
        `INSERT INTO clients (
        id, first_name, last_name, investment_manager, knowledge_experience,
        loss_pct, account_number, salutation, objective, risk, email, phone, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          client.firstName,
          client.lastName,
          client.investmentManager || null,
          client.knowledgeExperience,
          client.lossPct,
          client.accountNumber,
          client.salutation || null,
          client.objective,
          client.risk,
          client.email || null,
          client.phone || null,
          client.address || null,
        ]
    );

    return { ...client, id };
  },

  // Update existing client
  async update(id: string, client: Partial<Client>): Promise<boolean> {
    const database = await getDb();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (client.firstName !== undefined) {
      fields.push("first_name = ?");
      values.push(client.firstName);
    }
    if (client.lastName !== undefined) {
      fields.push("last_name = ?");
      values.push(client.lastName);
    }
    if (client.investmentManager !== undefined) {
      fields.push("investment_manager = ?");
      values.push(client.investmentManager);
    }
    if (client.knowledgeExperience !== undefined) {
      fields.push("knowledge_experience = ?");
      values.push(client.knowledgeExperience);
    }
    if (client.lossPct !== undefined) {
      fields.push("loss_pct = ?");
      values.push(client.lossPct);
    }
    if (client.accountNumber !== undefined) {
      fields.push("account_number = ?");
      values.push(client.accountNumber);
    }
    if (client.salutation !== undefined) {
      fields.push("salutation = ?");
      values.push(client.salutation);
    }
    if (client.objective !== undefined) {
      fields.push("objective = ?");
      values.push(client.objective);
    }
    if (client.risk !== undefined) {
      fields.push("risk = ?");
      values.push(client.risk);
    }
    if (client.email !== undefined) {
      fields.push("email = ?");
      values.push(client.email);
    }
    if (client.phone !== undefined) {
      fields.push("phone = ?");
      values.push(client.phone);
    }
    if (client.address !== undefined) {
      fields.push("address = ?");
      values.push(client.address);
    }

    if (fields.length === 0) return false;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const result = await database.execute(
        `UPDATE clients SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    return result.rowsAffected > 0;
  },

  // Delete client
  async delete(id: string): Promise<boolean> {
    const database = await getDb();
    const result = await database.execute(
        "DELETE FROM clients WHERE id = ?",
        [id]
    );
    return result.rowsAffected > 0;
  },

  // Seed database with initial data (LEGACY - can be removed later if desired)
  async seed(clients: Client[]): Promise<void> {
    const database = await getDb();

    // Check if data already exists
    const existing = await database.select<{ count: number }[]>(
        "SELECT COUNT(*) as count FROM clients"
    );

    if (existing[0].count > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Insert all clients
    for (const client of clients) {
      await database.execute(
          `INSERT INTO clients (
          id, first_name, last_name, investment_manager, knowledge_experience,
          loss_pct, account_number, salutation, objective, risk, email, phone, address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            client.id,
            client.firstName,
            client.lastName,
            client.investmentManager || null,
            client.knowledgeExperience,
            client.lossPct,
            client.accountNumber,
            client.salutation || null,
            client.objective,
            client.risk,
            client.email || null,
            client.phone || null,
            client.address || null,
          ]
      );
    }

    console.log(`Seeded ${clients.length} clients`);
  },

  // Replace all data with new list
  async replaceAll(clients: Client[]): Promise<void> {
    const database = await getDb();

    // 1. Clear existing data
    await database.execute("DELETE FROM clients");

    // 2. Insert new data
    for (const client of clients) {
      await database.execute(
          `INSERT INTO clients (
          id, first_name, last_name, investment_manager, knowledge_experience,
          loss_pct, account_number, salutation, objective, risk, email, phone, address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            client.id,
            client.firstName,
            client.lastName,
            client.investmentManager || null,
            client.knowledgeExperience,
            client.lossPct,
            client.accountNumber,
            client.salutation || null,
            client.objective,
            client.risk,
            client.email || null,
            client.phone || null,
            client.address || null,
          ]
      );
    }
    console.log(`Replaced database with ${clients.length} clients`);
  }
};

export default clientDb;