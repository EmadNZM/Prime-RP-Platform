import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || (process.env.NODE_ENV !== "production" ? "ChangeMe123!" : undefined);
  if (!initialPassword) throw new Error("Set ADMIN_INITIAL_PASSWORD before seeding a production database.");
  const passwordHash = await bcrypt.hash(initialPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@primerp.local" },
    update: {},
    create: {
      email: "admin@primerp.local",
      passwordHash,
      name: "Prime Administrator",
      role: Role.SUPER_ADMIN,
      locale: "ar"
    }
  });

  const jobs = [
    ["police", "police", "الشرطة", "Police", "حماية المدينة وتطبيق القانون.", "Protect the city and enforce the law."],
    ["ems", "ems", "الإسعاف", "EMS", "الاستجابة للحالات الطبية والطوارئ.", "Respond to medical emergencies and calls."],
    ["mechanic", "mechanic", "الميكانيكي", "Mechanic", "صيانة المركبات وخدمة المدينة.", "Maintain vehicles and serve the city."],
    ["government", "government", "الحكومة", "Government", "إدارة الخدمات والجهات الرسمية.", "Manage public services and official departments."]
  ];

  for (const [slug, icon, titleAr, titleEn, descriptionAr, descriptionEn] of jobs) {
    await prisma.job.upsert({
      where: { slug },
      update: {},
      create: { slug, icon, titleAr, titleEn, descriptionAr, descriptionEn }
    });
  }

  await prisma.newsPost.upsert({
    where: { slug: "prime-rp-launch" },
    update: {},
    create: {
      slug: "prime-rp-launch",
      titleAr: "مرحباً بكم في Prime RP",
      titleEn: "Welcome to Prime RP",
      excerptAr: "هوية جديدة، تجربة جديدة، وقصة تبدأ منك.",
      excerptEn: "A new identity, a new experience, and a story that starts with you.",
      contentAr: "نحن نبني مساحة Roleplay تركز على التفاصيل والتجربة والمجتمع.",
      contentEn: "We are building a Roleplay experience focused on detail, immersion and community.",
      published: true
    }
  });
}

main().finally(() => prisma.$disconnect());
