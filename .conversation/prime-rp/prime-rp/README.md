# Prime RP — Full Web Platform

A production-minded bilingual Arabic/English website + admin foundation for Prime RP. The current release is intentionally **standalone**: there is no FiveM/server integration.

## Stack
- Next.js App Router + TypeScript
- Custom responsive premium dark UI
- Arabic RTL / English LTR routes (`/ar`, `/en`)
- PostgreSQL + Prisma
- Password login with bcrypt + signed HttpOnly session cookie
- Role-ready database (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `SUPPORT`, `EDITOR`)
- Audit log foundation
- Docker Compose for local PostgreSQL

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`, set `AUTH_SECRET` to a random value of at least 32 characters, and set a unique `ADMIN_INITIAL_PASSWORD`.
3. Start PostgreSQL:
   `docker compose up -d`
4. Install dependencies:
   `npm install`
5. Create the database schema:
   `npm run db:push`
6. Seed initial content:
   `npm run db:seed`
7. Start:
   `npm run dev`
8. Open `/ar` or `/en`.

## Initial admin
- Email: `admin@primerp.local`
- Password: the value of `ADMIN_INITIAL_PASSWORD` (development-only fallback: `ChangeMe123!`).

Never use the development fallback in a real deployment.

## Architecture notes
The public site reads content from PostgreSQL with safe fallback content for the first boot. The dashboard is protected server-side. FiveM integration is deliberately absent for phase 1, but the data/API boundaries are structured so it can be added later without redesigning the public UI.

## Next production phases
1. Full CRUD admin screens for news/rules/jobs/store/tickets.
2. Strong RBAC permission matrix + 2FA.
3. Discord OAuth for community accounts.
4. Image/media storage (S3-compatible).
5. Rate limiting, CSRF/origin checks, security headers and structured audit events.
6. Payment provider after store requirements are defined.
7. Optional FiveM resource + API integration.
