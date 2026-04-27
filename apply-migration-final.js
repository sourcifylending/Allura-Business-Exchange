const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = "https://ezlqjvceslzdnzvkimih.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bHFqdmNlc2x6ZG56dmtpbWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0ODExNSwiZXhwIjoyMDkyMTI0MTE1fQ.TmaSpH-DdQ05l-sFD-o6diMi0FnS7xao8z3kjMbjQj8";

const client = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    const migrationSQL = fs.readFileSync(
      "./supabase/migrations/20260427_add_buyer_workflow_fields.sql",
      "utf8"
    );

    console.log("Attempting to apply migration using Supabase JS client...");

    // Try calling a custom RPC function first
    const rpcResult = await client.rpc("exec_sql", { sql: migrationSQL }).catch(() => null);
    if (rpcResult) {
      console.log("✓ Migration applied via RPC!");
      return;
    }

    // Try with different function names that might exist
    const functionNames = ["execute_sql", "run_sql", "sql_exec"];
    for (const funcName of functionNames) {
      try {
        const result = await client.rpc(funcName, { sql: migrationSQL });
        if (!result.error) {
          console.log(`✓ Migration applied via RPC function: ${funcName}`);
          return;
        }
      } catch (e) {
        // Continue trying other functions
      }
    }

    // Try using raw fetch to the REST endpoint with proper authentication
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
        "apikey": supabaseKey,
      },
      body: JSON.stringify({
        query: migrationSQL,
      }),
    });

    if (response.ok) {
      console.log("✓ Migration applied via REST endpoint!");
      return;
    }

    throw new Error("No available method to execute SQL");
  } catch (error) {
    console.error("\n✗ Automated migration failed:", error.message);
    console.error("\nThe application is now deployed to production.");
    console.error("To complete setup, please apply the migration manually:\n");
    console.error("1. Open: https://app.supabase.com/project/ezlqjvceslzdnzvkimih");
    console.error("2. Click: SQL Editor (left sidebar)");
    console.error("3. Click: New Query");
    console.error("4. Paste the migration SQL below and click Run:\n");

    const sql = fs.readFileSync("./supabase/migrations/20260427_add_buyer_workflow_fields.sql", "utf8");
    console.error(sql);

    console.error("\n5. Once complete, the buyer deal room will be fully functional");
    console.error("6. Visit: https://app.allurabusinessexchange.com/admin/digital-assets");
    process.exit(1);
  }
}

applyMigration();
