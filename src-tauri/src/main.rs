// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

// Client struct matching your TypeScript types
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Client {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub investment_manager: Option<String>,
    pub knowledge_experience: String,
    pub loss_pct: i32,
    pub account_number: String,
    pub type_account: String,
    pub salutation: Option<String>,
    pub objective: String,
    pub risk: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub power_of_attorney: Option<String>,
    pub annual_review_date: String,
    pub fees_commission_rate: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientList {
    pub items: Vec<Client>,
    pub total: usize,
}

// Get app version
#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

// Greet command (example)
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Vinco Wealth.", name)
}

fn main() {
    // Define database migrations
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_clients_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS clients (
                    id TEXT PRIMARY KEY,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    investment_manager TEXT,
                    knowledge_experience TEXT NOT NULL DEFAULT 'Medium',
                    loss_pct INTEGER NOT NULL DEFAULT 0,
                    account_number TEXT NOT NULL,
                    salutation TEXT,
                    objective TEXT NOT NULL DEFAULT 'Balance',
                    risk TEXT NOT NULL DEFAULT 'Medium',
                    email TEXT,
                    phone TEXT,
                    address TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(last_name, first_name);
                CREATE INDEX IF NOT EXISTS idx_clients_manager ON clients(investment_manager);
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_trades_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS trades (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_id TEXT NOT NULL,
                    asset_name TEXT NOT NULL,
                    account_type TEXT NOT NULL DEFAULT 'ISA',
                    asset_type TEXT NOT NULL DEFAULT 'Equity',
                    asset_risk TEXT NOT NULL DEFAULT 'Medium',
                    side TEXT NOT NULL DEFAULT 'Buy',
                    quantity TEXT,
                    time_of_trade TEXT,
                    date_of_trade TEXT,
                    reason_1 TEXT,
                    reason_2 TEXT,
                    reason_3 TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (client_id) REFERENCES clients(id)
                );

                CREATE INDEX IF NOT EXISTS idx_trades_client ON trades(client_id);
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_suitability_letters_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS suitability_letters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_id TEXT NOT NULL,
                    content TEXT,
                    pdf_path TEXT,
                    status TEXT NOT NULL DEFAULT 'draft',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (client_id) REFERENCES clients(id)
                );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "add_account_type_to_clients",
            sql: r#"
            ALTER TABLE clients ADD COLUMN type_account TEXT;
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "add_powerOfAttorney_annualReviewDate_feesCommissionRate_types_to_clients",
            sql: r#"
            ALTER TABLE clients ADD COLUMN power_of_attorney TEXT;
            ALTER TABLE clients ADD COLUMN annual_review_date TEXT NOT NULL DEFAULT 'N/A';
            ALTER TABLE clients ADD COLUMN fees_commission_rate TEXT NOT NULL DEFAULT 'N/A';
            "#,
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:timescapital.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            greet,
            get_app_version,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Vinco Wealth Management").unwrap();

            #[cfg(debug_assertions)]
            {
                println!("Vinco Wealth Management app started successfully!");
                println!("Database will be created at: vincowealth.db");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
