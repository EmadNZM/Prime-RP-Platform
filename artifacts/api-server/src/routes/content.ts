import { Router, type IRouter } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { GetPublicContentResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  jobsTable,
  newsTable,
  productsTable,
  rulesTable,
} from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/content", async (_req, res) => {
  const [jobs, news, rules, products] = await Promise.all([
    db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.active, true))
      .orderBy(asc(jobsTable.sortOrder)),
    db
      .select()
      .from(newsTable)
      .where(eq(newsTable.published, true))
      .orderBy(desc(newsTable.createdAt)),
    db
      .select()
      .from(rulesTable)
      .where(eq(rulesTable.published, true))
      .orderBy(asc(rulesTable.sortOrder)),
    db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.active, true), eq(productsTable.featured, true))),
  ]);

  const data = GetPublicContentResponse.parse({
    jobs: jobs.map(({ id, slug, titleAr, titleEn, descriptionAr, descriptionEn, icon }) => ({
      id,
      slug,
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      icon,
    })),
    news: news.map(({ id, slug, titleAr, titleEn, excerptAr, excerptEn, contentAr, contentEn, createdAt }) => ({
      id,
      slug,
      titleAr,
      titleEn,
      excerptAr,
      excerptEn,
      contentAr,
      contentEn,
      createdAt,
    })),
    rules: rules.map(({ id, category, titleAr, titleEn, contentAr, contentEn }) => ({
      id,
      category,
      titleAr,
      titleEn,
      contentAr,
      contentEn,
    })),
    products: products.map(({ id, nameAr, nameEn, descriptionAr, descriptionEn, price, currency, featured }) => ({
      id,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price: Number(price),
      currency,
      featured,
    })),
    stats: {
      jobs: jobs.length,
      news: news.length,
      rules: rules.length,
      products: products.length,
    },
  });

  res.json(data);
});

export default router;