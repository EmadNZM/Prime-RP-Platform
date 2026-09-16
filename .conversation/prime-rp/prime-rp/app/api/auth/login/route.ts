import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const key = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const entry = attempts.get(key);
    if (entry && entry.resetAt > Date.now() && entry.count >= 5) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    const body: unknown = await req.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { email, password } = body as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string" || email.length > 254 || password.length > 256) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
      attempts.set(key, { count: (entry?.count || 0) + 1, resetAt: Date.now() + 15 * 60_000 });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    attempts.delete(key);
    await createSession({ id: user.id, email: user.email, role: user.role, name: user.name });
    await db.auditLog.create({ data: { action: "LOGIN", entity: "User", entityId: user.id, userId: user.id } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
