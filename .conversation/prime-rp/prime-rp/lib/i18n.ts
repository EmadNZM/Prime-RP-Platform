export type Locale = "ar" | "en";
export const locales: Locale[] = ["ar", "en"];
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const copy = {
  ar: {
    home: "الرئيسية", about: "عن Prime RP", rules: "القوانين", jobs: "الوظائف", news: "الأخبار", store: "المتجر", support: "الدعم",
    login: "دخول الإدارة", play: "ابدأ قصتك", discord: "انضم للديسكورد", heroEyebrow: "مدينة واحدة • آلاف القصص",
    heroTitle: "قصتك تبدأ هنا.", heroText: "Prime RP — عالم رول بلاي مصمم حول التفاصيل، الاختيارات، والمجتمع.",
    status: "الموقع يعمل", online: "متاح", explore: "استكشف Prime RP", latest: "آخر الأخبار", viewAll: "عرض الكل",
    jobsTitle: "اختر طريقك", jobsText: "من الشرطة إلى الإسعاف والميكانيك والحكومة، كل وظيفة تفتح لك قصة مختلفة.",
    rulesTitle: "قواعد تصنع تجربة أفضل", rulesText: "نضع الوضوح واللعب النظيف واحترام المجتمع في قلب التجربة.",
    footer: "Prime RP. Built for stories that matter.", admin: "لوحة الإدارة", email: "البريد الإلكتروني", password: "كلمة المرور", signIn: "تسجيل الدخول"
  },
  en: {
    home: "Home", about: "About Prime RP", rules: "Rules", jobs: "Jobs", news: "News", store: "Store", support: "Support",
    login: "Admin Login", play: "Start Your Story", discord: "Join Discord", heroEyebrow: "One city • Thousands of stories",
    heroTitle: "Your story starts here.", heroText: "Prime RP — a roleplay world built around detail, choices, and community.",
    status: "Website status", online: "Online", explore: "Explore Prime RP", latest: "Latest News", viewAll: "View all",
    jobsTitle: "Choose your path", jobsText: "From police and EMS to mechanics and government, every role opens a different story.",
    rulesTitle: "Rules for a better experience", rulesText: "Clarity, fair play, and respect for the community are at the heart of Prime RP.",
    footer: "Prime RP. Built for stories that matter.", admin: "Admin Dashboard", email: "Email", password: "Password", signIn: "Sign in"
  }
} as const;
