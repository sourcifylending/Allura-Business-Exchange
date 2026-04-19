# AI Architecture

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

## Scope
- No AI integration yet.
- No Ollama connection yet.
- Preserve this architecture in docs and future scaffolding only.
