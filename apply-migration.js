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

    // Execute the migration
    const { error } = await client.rpc("execute_sql", {
      sql: migrationSQL,
    });

    if (error) {
      // If RPC doesn't exist, try direct execution
      console.log("RPC method not available, attempting direct SQL execution...");
      // Note: This would require admin access via the query editor
      console.error("Error:", error);
      process.exit(1);
    }

    console.log("✓ Migration applied successfully!");
  } catch (error) {
    console.error("Failed to apply migration:", error);
    process.exit(1);
  }
}

applyMigration();
