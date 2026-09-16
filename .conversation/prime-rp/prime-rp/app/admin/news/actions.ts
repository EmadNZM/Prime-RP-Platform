"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";

const clean = (value: FormDataEntryValue | null, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function createNews(formData: FormData) {
  const session = await requireAdmin(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const slug = clean(formData.get("slug"), 100).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");
  const titleAr = clean(formData.get("titleAr"), 180), titleEn = clean(formData.get("titleEn"), 180);
  const excerptAr = clean(formData.get("excerptAr"), 400), excerptEn = clean(formData.get("excerptEn"), 400);
  const contentAr = clean(formData.get("contentAr"), 20_000), contentEn = clean(formData.get("contentEn"), 20_000);
  if (!slug || !titleAr || !titleEn || !contentAr || !contentEn) throw new Error("Required bilingual news fields are missing.");
  const post = await db.newsPost.create({ data: { slug, titleAr, titleEn, excerptAr, excerptEn, contentAr, contentEn, published: formData.get("published") === "on" } });
  await db.auditLog.create({ data: { action: "CREATE", entity: "NewsPost", entityId: post.id, userId: session.id } });
  revalidatePath("/ar"); revalidatePath("/en"); revalidatePath("/ar/news"); revalidatePath("/en/news"); revalidatePath("/admin/news");
}

export async function toggleNews(formData: FormData) {
  const session = await requireAdmin(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const id = clean(formData.get("id"), 40), published = formData.get("published") === "true";
  if (!id) return;
  await db.newsPost.update({ where: { id }, data: { published: !published } });
  await db.auditLog.create({ data: { action: !published ? "PUBLISH" : "UNPUBLISH", entity: "NewsPost", entityId: id, userId: session.id } });
  revalidatePath("/ar"); revalidatePath("/en"); revalidatePath("/ar/news"); revalidatePath("/en/news"); revalidatePath("/admin/news");
}
