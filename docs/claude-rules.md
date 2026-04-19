# Claude Rules

## Operating Rules
- Stay local only.
- Do not connect to external services without explicit approval.
- Do not reuse or reference SourcifyLending assets, settings, projects, keys, or integrations.
- Work only on the current phase.
- Do not build future phases early.
- Do not refactor unrelated files.
- Keep changes small and targeted.
- Verify before claiming success.
- Be concise.
- Do not assume when inspection is possible.

## Phase Rules
- Phase 0 creates docs only.
- No app scaffold yet.
- No database work yet.
- No auth work yet.
- No deployment work yet.
- No payment processor work yet.
- No e-sign vendor work yet.

## Safety Rules
- If any step requires an external service, stop and ask first.
- Treat SourcifyLending as off-limits unless explicitly requested for reference only.
- Never assume existing projects are safe to reuse.
- Do not touch live integrations or production settings.

## Internal AI Only Rule
- AI is for internal Allura staff/admin use only.
- Customer-facing routes must work fully without AI.
- Buyers and sellers should never depend on AI to browse listings, create accounts, submit inquiries, upload documents, review opportunities, sign contracts, or track status.
- AI should be used only inside the internal admin portal.
- Internal AI use cases include:
  - Market Radar research summaries
  - idea scoring drafts
  - packaging drafts
  - listing copy drafts
  - buyer discovery recommendations
  - evaluation / underwriting drafts
  - semantic search across assets, notes, and records
- Build the AI layer with provider abstraction.
- Default internal AI target is local Ollama first.
- Do not connect OpenAI, Anthropic, or any external AI provider unless explicitly approved later.
- Do not make any public-facing route require AI to function.

## AI Architecture Note
- Create the app so the AI service sits behind an internal admin-only service layer.
- Public site, buyer portal, and seller portal should call no AI service directly.
- Internal admin modules may later call an abstract AI provider interface.
- Default future provider path:
  - ollama
  - openai
  - anthropic
  - self_hosted

## Output Rules
When reporting progress, return only:
- summary
- exact files changed
- key decisions
- manual review checklist
- blockers requiring input
