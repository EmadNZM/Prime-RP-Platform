# Prime RP

Prime RP is a bilingual Arabic/English roleplay community platform with public city content and a protected admin foundation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/prime-rp run dev` — run the Prime RP web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/prime-rp/` — Vite public web app and Prime RP visual system
- `artifacts/api-server/` — Express API service mounted at `/api`
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — Drizzle database schema
- `lib/api-client-react/src/generated/` — generated React Query client

## Architecture decisions

- Public content is served through the shared API service so the browser never connects directly to PostgreSQL.
- Arabic and English share the same content response and select localized fields at render time.
- Prime RP's existing dark civic/editorial visual identity and logo are preserved in the Vite artifact.
- The first hosted surface focuses on public community content; admin mutations remain a later phase.

## Product

- Bilingual home page with community positioning and city status
- Careers, news, rules, and store routes for published Prime RP content
- Responsive navigation with Arabic RTL / English LTR locale switching
- Database-backed public content and summary counts

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Re-run API codegen after changing `lib/api-spec/openapi.yaml`.
- Use the managed artifact workflows instead of starting Vite or Express with hand-written ports.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
