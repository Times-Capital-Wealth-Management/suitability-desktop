# Times Capital - Tauri Desktop App Setup Guide

Complete guide to set up your Next.js application as a desktop app with Tauri and SQLite.

## What's Included

```
tauri-complete/
├── src-tauri/                    # Tauri backend (Rust)
│   ├── src/main.rs               # Main entry with SQLite setup
│   ├── capabilities/default.json # Security permissions
│   ├── tauri.conf.json          # App configuration
│   ├── Cargo.toml               # Rust dependencies
│   └── build.rs                 # Build script
├── lib/                          # Shared utilities
│   ├── tauri.ts                 # Tauri API helpers
│   ├── database.ts              # SQLite operations
│   ├── data-provider.ts         # Unified data access
│   └── file-utils.ts            # PDF saving utilities
├── hooks/
│   └── use-tauri.ts             # React hooks for Tauri + data
├── app/                          # Updated pages (client-side)
│   ├── page.tsx                 # Home page
│   ├── clients/page.tsx         # Clients list
│   ├── suitability/page.tsx     # Suitability workspace
│   ├── documents/page.tsx       # Documents
│   ├── settings/page.tsx        # Settings
│   └── login/page.tsx           # Login
├── components/
│   └── clients/
│       └── client-details-sheet.tsx  # Updated to use data provider
├── package.json                  # Updated with Tauri deps
└── next.config.ts               # Static export config
```

## Prerequisites

### 1. Install Rust

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Windows:**
Download and run: https://win.rustup.rs/

Verify installation:
```bash
rustc --version  # Should show 1.70+
cargo --version
```

### 2. Install System Dependencies

**macOS:**
```bash
xcode-select --install
```

**Windows:**
- Install [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Select "Desktop development with C++" workload

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

**Fedora:**
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file \
  libxdo-devel libappindicator-gtk3-devel librsvg2-devel
```

---

## Installation

### Step 1: Extract Files

Extract the `tauri-complete.zip` into your project root, merging with existing files:

```bash
unzip tauri-complete.zip -d your-project/
```

### Step 2: Install Dependencies

```bash
cd your-project
npm install
```

### Step 3: Create App Icons

Create placeholder icons in `src-tauri/icons/`:

```bash
mkdir -p src-tauri/icons
# Add your icons:
# - 32x32.png
# - 128x128.png  
# - 128x128@2x.png
# - icon.icns (macOS)
# - icon.ico (Windows)
```

Or use a tool to generate them:
```bash
# Install tauri-icon-builder
npm install -g @aspect-dev/tauri-icon-builder
# Generate from a source image
tauri-icon-builder -i logo.png -o src-tauri/icons
```

---

## Running the App

### Development Mode

```bash
npm run tauri:dev
```

This will:
1. Start Next.js dev server on port 3000
2. Compile the Rust backend
3. Open the desktop app window
4. Create SQLite database on first run

### Production Build

```bash
npm run tauri:build
```

Build outputs:
- **macOS:** `src-tauri/target/release/bundle/dmg/`
- **Windows:** `src-tauri/target/release/bundle/msi/` or `nsis/`
- **Linux:** `src-tauri/target/release/bundle/appimage/` or `deb/`

---

## Architecture

### Dual-Mode Operation

The app works in both browser and desktop modes:

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│                                                      │
│  useClients() ─────► clientProvider.getAll()        │
│                              │                       │
│              ┌───────────────┴───────────────┐      │
│              ▼                               ▼      │
│     ┌─────────────┐                 ┌─────────────┐ │
│     │   Browser   │                 │   Desktop   │ │
│     │  (Web Mode) │                 │(Tauri Mode) │ │
│     │             │                 │             │ │
│     │ fetch('/api │                 │  SQLite DB  │ │
│     │  /clients') │                 │ (local)     │ │
│     └─────────────┘                 └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **Components** use hooks like `useClients()`, `useClient(id)`
2. **Hooks** call the `data-provider.ts` functions
3. **Data Provider** checks if running in Tauri:
   - **Desktop:** Uses SQLite via `database.ts`
   - **Browser:** Uses fetch API or falls back to mock data

### Database Schema

The SQLite database has three tables:

```sql
-- Clients table
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  investment_manager TEXT,
  knowledge_experience TEXT DEFAULT 'Medium',
  loss_pct INTEGER DEFAULT 0,
  account_number TEXT NOT NULL,
  salutation TEXT,
  objective TEXT DEFAULT 'Balance',
  risk TEXT DEFAULT 'Medium',
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at DATETIME,
  updated_at DATETIME
);

-- Trades table
CREATE TABLE trades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  account_type TEXT DEFAULT 'ISA',
  asset_type TEXT DEFAULT 'Equity',
  asset_risk TEXT DEFAULT 'Medium',
  side TEXT DEFAULT 'Buy',
  quantity TEXT,
  time_of_trade TEXT,
  date_of_trade TEXT,
  reason_1 TEXT,
  reason_2 TEXT,
  reason_3 TEXT,
  created_at DATETIME
);

-- Suitability letters table
CREATE TABLE suitability_letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,
  content TEXT,
  pdf_path TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME,
  updated_at DATETIME
);
```

---

## Key Files Explained

### `lib/tauri.ts`
Helper to check if running in Tauri and invoke Rust commands:
```typescript
import { isTauri, invoke } from "@/lib/tauri";

if (isTauri()) {
  const version = await invoke<string>("get_app_version");
}
```

### `lib/database.ts`
SQLite operations for clients:
```typescript
import { clientDb } from "@/lib/database";

// Get all clients
const clients = await clientDb.getAll();

// Search
const results = await clientDb.search("Ahmed");

// Create
const newClient = await clientDb.create({ firstName: "John", ... });
```

### `lib/data-provider.ts`
Unified data access that works everywhere:
```typescript
import { clientProvider } from "@/lib/data-provider";

// Works in browser AND desktop
const clients = await clientProvider.getAll();
```

### `lib/file-utils.ts`
Native file dialogs for saving PDFs:
```typescript
import { savePdfToFile } from "@/lib/file-utils";

// Shows native save dialog on desktop, triggers download in browser
const path = await savePdfToFile(pdfBlob, "report.pdf");
```

### `hooks/use-tauri.ts`
React hooks for data fetching:
```typescript
import { useClients, useClient, useTauri } from "@/hooks/use-tauri";

function MyComponent() {
  const { isDesktop } = useTauri();
  const { data, loading, refresh } = useClients();
  const { client } = useClient("c1");
}
```

---

## Troubleshooting

### "Cannot find module @tauri-apps/api"
```bash
npm install @tauri-apps/api @tauri-apps/plugin-dialog @tauri-apps/plugin-fs @tauri-apps/plugin-sql
```

### Rust compilation errors
```bash
cd src-tauri
cargo clean
cargo build
```

### Database not created
Check permissions and ensure the app has write access to its data directory.

### Window doesn't open
Verify `devUrl` in `tauri.conf.json` matches your Next.js port (default: 3000).

### Static export errors
All pages must use `"use client"` directive. Remove:
- `headers()` calls
- `cookies()` calls
- Server-only imports

---

## Next Steps

After setup is complete:

1. ✅ Test development mode: `npm run tauri:dev`
2. ⬜ Add your app icons
3. ⬜ Customize window title/size in `tauri.conf.json`
4. ⬜ Add more database operations as needed
5. ⬜ Set up code signing for distribution
6. ⬜ Build for production: `npm run tauri:build`

---

## Resources

- [Tauri v2 Documentation](https://v2.tauri.app/)
- [Tauri + Next.js Guide](https://v2.tauri.app/start/frontend/nextjs/)
- [tauri-plugin-sql](https://v2.tauri.app/plugin/sql/)
- [Rust Book](https://doc.rust-lang.org/book/)
