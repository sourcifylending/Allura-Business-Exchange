import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header (admin key)
    const authHeader = request.headers.get("authorization");
    const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const providedKey = authHeader.substring(7);
    if (providedKey !== expectedKey) {
      return NextResponse.json({ error: "Invalid authorization key" }, { status: 401 });
    }

    // Create admin client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    // Read migration SQL - we'll embed it instead of reading from file
    const migrationSQL = `
-- Add buyer workflow tracking fields to digital_asset_buyer_interest
alter table if exists public.digital_asset_buyer_interest
add column if not exists nda_sent_date timestamptz,
add column if not exists nda_signed_date timestamptz,
add column if not exists signed_nda_url text,
add column if not exists next_follow_up_date date,
add column if not exists buyer_stage text default 'new',
add column if not exists document_generated_at timestamptz;

-- Add constraint for buyer_stage values
alter table public.digital_asset_buyer_interest
drop constraint if exists digital_asset_buyer_interest_buyer_stage_check;

alter table public.digital_asset_buyer_interest
add constraint digital_asset_buyer_interest_buyer_stage_check
check (buyer_stage in ('new', 'nda_sent', 'nda_signed', 'reviewing', 'offer', 'closed', 'dead'));
`;

    // Execute each statement separately
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let rpcFailed = false;
    for (const statement of statements) {
      try {
        const { error } = await adminClient.rpc("exec_sql", { sql: statement });
        if (error) {
          console.error("SQL execution error:", error);
          rpcFailed = true;
        }
      } catch (err) {
        console.error("RPC call failed:", err);
        rpcFailed = true;
      }
    }

    if (rpcFailed) {
      return NextResponse.json({
        success: false,
        message: "RPC function not available on server. Apply migration manually:",
        steps: [
          "1. Visit: https://app.supabase.com/project/ezlqjvceslzdnzvkimih",
          "2. Click: SQL Editor",
          "3. Click: New Query",
          "4. Paste the migration SQL and run it",
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Migration applied successfully",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        error: "Failed to apply migration",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
