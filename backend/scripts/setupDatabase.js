/**
 * Database Setup Script
 * Run: node scripts/setupDatabase.js
 *
 * Applies schema.sql to your Supabase project via the management API.
 * Alternatively, paste schema.sql into Supabase Dashboard → SQL Editor manually.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "❌  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env\n" +
      "    Copy .env.example → .env and fill in your credentials."
    );
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    console.error("❌  Could not parse project ref from SUPABASE_URL");
    process.exit(1);
  }

  console.log(`📡 Applying schema to project: ${projectRef}`);

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (response.ok) {
    console.log("✅  Schema applied successfully!");
    console.log("    Your Raven Guard database is ready.");
  } else {
    const text = await response.text();
    console.error("❌  Schema application failed:", text);
    console.log("\n💡  Tip: Paste scripts/schema.sql manually into:");
    console.log("    Supabase Dashboard → SQL Editor → New Query");
  }
}

main().catch(console.error);
