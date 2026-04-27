const fs = require("fs");

const projectRef = "ezlqjvceslzdnzvkimih";
const supabaseUrl = "https://ezlqjvceslzdnzvkimih.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bHFqdmNlc2x6ZG56dmtpbWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0ODExNSwiZXhwIjoyMDkyMTI0MTE1fQ.TmaSpH-DdQ05l-sFD-o6diMi0FnS7xao8z3kjMbjQj8";

async function applyMigration() {
  try {
    const migrationSQL = fs.readFileSync(
      "./supabase/migrations/20260427_add_buyer_workflow_fields.sql",
      "utf8"
    );

    console.log("Attempting to apply migration via Supabase Management API...");

    // Try using Supabase's database API to execute SQL
    // This endpoint might exist for admin operations
    const endpoints = [
      `${supabaseUrl}/rest/v1/exec_sql`,
      `${supabaseUrl}/rest/v1/sql`,
      `${supabaseUrl}/functions/v1/sql-runner`,
      `https://api.supabase.com/api/v1/projects/${projectRef}/sql`,
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${serviceRoleKey}`,
            "apikey": serviceRoleKey,
          },
          body: JSON.stringify({ sql: migrationSQL, query: migrationSQL }),
        });

        const data = await response.json();

        if (response.ok && !data.error) {
          console.log("✓ Migration applied successfully!");
          console.log(data);
          return;
        }

        console.log(`${endpoint} response:`, response.status, data.error || data.message);
      } catch (e) {
        console.log(`${endpoint} failed:`, e.message);
      }
    }

    throw new Error("No available API endpoint for SQL execution");
  } catch (error) {
    console.error("\n✗ Could not apply migration via API:", error.message);
    console.error("\n" + "=".repeat(70));
    console.error("MANUAL MIGRATION REQUIRED");
    console.error("=".repeat(70));
    console.error("\nPlease apply this migration via the Supabase Dashboard:");
    console.error("1. Visit: https://app.supabase.com/project/ezlqjvceslzdnzvkimih");
    console.error("2. Go to: SQL Editor (left sidebar)");
    console.error("3. Click: New Query");
    console.error("4. Paste the SQL below:");
    console.error("\n---");

    try {
      const sql = fs.readFileSync("./supabase/migrations/20260427_add_buyer_workflow_fields.sql", "utf8");
      console.error(sql);
    } catch (e) {
      console.error("Error reading migration file");
    }

    console.error("---\n");
    console.error("5. Click: Run");
    console.error("6. Once complete, run: vercel deploy --prod");
    process.exit(1);
  }
}

applyMigration();
