-- Seed initial digital assets (idempotent - only insert if not exists)
insert into public.digital_assets (
  name,
  slug,
  status,
  asset_type,
  revenue_stage,
  build_status,
  asking_price,
  local_path,
  visibility,
  nda_required,
  short_description,
  notes
) values
  (
    'SourcifyLending',
    'sourcify-lending',
    'for_sale',
    'Software / SaaS / Advisory Platform',
    'Early Revenue',
    'Live / Operational',
    20000,
    'C:\Users\abelf\OneDrive\Desktop\Apps\SourcifyLending',
    'private',
    true,
    'Sales & Operations Control System for lending sourcing platform',
    'Operational platform in production. Ready for transition to new owner.'
  ),
  (
    'CombatPilot AI',
    'combat-pilot-ai',
    'in_build',
    'AI Software Platform',
    'Pre-Revenue',
    'Development',
    null,
    'C:\Users\abelf\OneDrive\Desktop\Apps\CombatPilot AI',
    'private',
    true,
    'AI-powered platform in active development',
    'Still in development. Pricing to be determined when ready for sale.'
  )
on conflict (slug) do nothing;
