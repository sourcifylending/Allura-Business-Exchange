const fs = require("fs");

// Supabase credentials from environment or hardcoded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ezlqjvceslzdnzvkimih.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bHFqdmNlc2x6ZG56dmtpbWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0ODExNSwiZXhwIjoyMDkyMTI0MTE1fQ.TmaSpH-DdQ05l-sFD-o6diMi0FnS7xao8z3kjMbjQj8";

async function applyMigration() {
  try {
    const migrationSQL = fs.readFileSync(
      "./supabase/migrations/20260427_add_buyer_workflow_fields.sql",
      "utf8"
    );

    console.log("Applying migration...");

    // Use Supabase HTTP API with service role key
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
        "apikey": supabaseKey,
      },
      body: JSON.stringify({ query: migrationSQL }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("REST API approach failed, trying direct HTTP POST to execute SQL...");

      // Try direct SQL execution via graphql endpoint
      const graphqlResponse = await fetch(`${supabaseUrl}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({
          query: `mutation ExecuteSql($sql: String!) { execute_sql(sql: $sql) }`,
          variables: { sql: migrationSQL },
        }),
      });

      const graphqlData = await graphqlResponse.json();
      if (graphqlData.errors) {
        throw new Error(JSON.stringify(graphqlData.errors));
      }
      console.log("✓ Migration applied successfully via GraphQL!");
      return;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    console.log("✓ Migration applied successfully!");
  } catch (error) {
    console.error("Failed to apply migration:", error.message);
    console.error("\nNote: The migration file is ready at supabase/migrations/20260427_add_buyer_workflow_fields.sql");
    console.error("You can apply it manually via: Supabase Dashboard > SQL Editor > paste the migration SQL");
    process.exit(1);
  }
}

applyMigration();
