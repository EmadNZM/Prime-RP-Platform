import { redirect } from "next/navigation";
import { AdminRole, getSession } from "./auth";
import { db } from "./db";

export async function requireAdmin(roles?: AdminRole[]) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const user = await db.user.findUnique({ where: { id: session.id }, select: { active: true, role: true } });
  if (!user?.active || (roles && !roles.includes(user.role))) redirect("/admin/login");
  return session;
}
