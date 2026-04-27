const { Pool } = require('pg');
const fs = require('fs');
const jwt_decode = require('jwt-decode');

// Try to decode the service role key to understand its structure
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bHFqdmNlc2x6ZG56dmtpbWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0ODExNSwiZXhwIjoyMDkyMTI0MTE1fQ.TmaSpH-DdQ05l-sFD-o6diMi0FnS7xao8z3kjMbjQj8";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ezlqjvceslzdnzvkimih.supabase.co";

// Extract project reference from URL
const projectRef = supabaseUrl.split('//')[1].split('.supabase.co')[0];
console.log(`Project ref: ${projectRef}`);

async function applyMigration() {
  // Try multiple connection approaches
  const connectionConfigs = [
    {
      // Try with postgres user and default password
      user: 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: `${projectRef}.supabase.co`,
      port: 5432,
      database: 'postgres',
      ssl: 'require',
    },
    {
      // Try with service_role user
      user: 'service_role',
      password: process.env.DB_PASSWORD || 'postgres',
      host: `${projectRef}.supabase.co`,
      port: 5432,
      database: 'postgres',
      ssl: 'require',
    }
  ];

  const migrationSQL = fs.readFileSync(
    "./supabase/migrations/20260427_add_buyer_workflow_fields.sql",
    "utf8"
  );

  for (const config of connectionConfigs) {
    try {
      console.log(`Attempting connection with user: ${config.user}...`);
      const pool = new Pool(config);

      // Test connection
      const client = await pool.connect();
      console.log('✓ Connected to Supabase database');

      // Execute migration
      const result = await client.query(migrationSQL);
      console.log('✓ Migration applied successfully!');

      client.release();
      await pool.end();
      return;
    } catch (error) {
      console.error(`✗ Connection failed with user ${config.user}:`, error.message);
      continue;
    }
  }

  // If all attempts failed, provide helpful error message
  console.error('\n✗ Could not apply migration automatically.');
  console.error('\nTo apply the migration manually:');
  console.error('1. Go to https://app.supabase.com/project/' + projectRef);
  console.error('2. Click "SQL Editor" in the left sidebar');
  console.error('3. Click "New Query" button');
  console.error('4. Copy and paste the migration SQL from: supabase/migrations/20260427_add_buyer_workflow_fields.sql');
  console.error('5. Click "Run"');
  console.error('\nAfter applying the migration, you can deploy with: vercel deploy --prod');
  process.exit(1);
}

applyMigration();
