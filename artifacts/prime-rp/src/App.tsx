import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleAlert,
  Compass,
  Globe2,
  Headphones,
  KeyRound,
  Landmark,
  LockKeyhole,
  Menu,
  Newspaper,
  Package,
  RefreshCw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import {
  getGetPublicContentQueryKey,
  getHealthCheckQueryKey,
  type Job,
  type NewsPost,
  type Product,
  type PublicContent,
  type Rule,
  useGetPublicContent,
  useHealthCheck,
} from '@workspace/api-client-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();
type Locale = 'ar' | 'en';

const copy = {
  ar: {
    dir: 'rtl' as const,
    home: 'الرئيسية',
    jobs: 'الوظائف',
    news: 'الأخبار',
    rules: 'القوانين',
    store: 'المتجر',
    enter: 'دخول المدينة',
    admin: 'إدارة Prime RP',
    menu: 'القائمة',
    heroEyebrow: 'مدينتك. قصتك. قرارك.',
    heroTitle: 'لا تلعب دوراً فقط، اصنع حياة.',
    heroBody: 'Prime RP ليست خريطة أخرى. إنها مدينة نابضة بقصص تُبنى من اختياراتك، وعلاقاتك، والدور الذي تقرر أن تلعبه كل ليلة.',
    explore: 'اكتشف المدينة',
    rulesCta: 'اقرأ القوانين',
    live: 'المدينة جاهزة',
    liveBody: 'مجتمع عربي وإنجليزي، قصص مشتركة، وتجارب تتطور مع كل لاعب.',
    latest: 'من قلب المدينة',
    latestBody: 'كل خبر يفتح باباً جديداً في قصتنا المشتركة.',
    seeAll: 'عرض الكل',
    careers: 'اختر مسارك',
    careersBody: 'كل مهنة تعطيك سبباً جديداً للاستيقاظ.',
    viewJobs: 'استعرض الوظائف',
    protocol: 'القواعد ليست عائقاً',
    protocolBody: 'هي ما يجعل كل مطاردة، صفقة، ولقاء يستحق أن يُروى.',
    readRules: 'تعرّف على البروتوكول',
    numbers: 'أرقام المدينة',
    numbersBody: 'تنمو Prime RP مع كل قصة جديدة.',
    featured: 'مختارات المتجر',
    featuredBody: 'أدوات صغيرة، حضور أكبر.',
    viewStore: 'زيارة المتجر',
    community: 'الساحة مفتوحة.',
    communityBody: 'انضم إلى مجتمع يعرف أن أفضل القصص لا تُكتب وحدها.',
    discord: 'انضم إلى المجتمع',
    footer: 'مدينة واحدة. احتمالات لا تنتهي.',
    loading: 'جاري تحميل المدينة',
    loadingBody: 'نرتب آخر التفاصيل قبل أن تفتح البوابة.',
    emptyTitle: 'المدينة هادئة الآن',
    emptyBody: 'لا توجد عناصر منشورة في هذا القسم بعد. عد قريباً.',
    errorTitle: 'تعذر الاتصال بالمدينة',
    errorBody: 'هناك مشكلة مؤقتة في الوصول إلى المحتوى المنشور.',
    retry: 'إعادة المحاولة',
    jobsTitle: 'كل مهنة تفتح قصة',
    jobsBody: 'ابدأ من المكان الذي يشبهك، ثم اكتب الباقي بطريقتك.',
    newsTitle: 'الأخبار من الشوارع',
    newsBody: 'تحديثات المجتمع، قصص المدينة، وما يستحق أن تعرفه.',
    rulesTitle: 'العب بجدية. عِش بحرية.',
    rulesBody: 'قواعد واضحة تحفظ مساحة اللعب للجميع، وتترك للخيال مكانه.',
    storeTitle: 'أشياء تستحق أن تقتنيها',
    storeBody: 'مختارات Prime RP التي تمنح حضورك علامة مميزة.',
    price: 'السعر',
    published: 'منشور',
    category: 'الفئة',
    adminTitle: 'غرفة التحكم',
    adminBody: 'مدخل خاص بفريق Prime RP. لوحة الإدارة ستتوفر هنا قريباً.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    protected: 'مساحة محمية',
    placeholder: 'هذه واجهة دخول تجريبية للوحة الإدارة.',
    status: 'حالة الخدمة',
    online: 'متصل',
  },
  en: {
    dir: 'ltr' as const,
    home: 'Home',
    jobs: 'Careers',
    news: 'News',
    rules: 'Rules',
    store: 'Store',
    enter: 'Enter the city',
    admin: 'Prime RP admin',
    menu: 'Menu',
    heroEyebrow: 'Your city. Your story. Your move.',
    heroTitle: 'Do not just play a role. Build a life.',
    heroBody: 'Prime RP is not another map. It is a living city shaped by your choices, your relationships, and the role you decide to play tonight.',
    explore: 'Explore the city',
    rulesCta: 'Read the rules',
    live: 'The city is ready',
    liveBody: 'An Arabic and English community, shared stories, and experiences that grow with every player.',
    latest: 'From inside the city',
    latestBody: 'Every update opens another door in our shared story.',
    seeAll: 'View all',
    careers: 'Choose your path',
    careersBody: 'Every career gives you a new reason to wake up.',
    viewJobs: 'Browse careers',
    protocol: 'Rules are not a barrier',
    protocolBody: 'They are what makes every chase, deal, and encounter worth telling.',
    readRules: 'Discover the protocol',
    numbers: 'City numbers',
    numbersBody: 'Prime RP grows with every new story.',
    featured: 'Store picks',
    featuredBody: 'Small details. A bigger presence.',
    viewStore: 'Visit the store',
    community: 'The square is open.',
    communityBody: 'Join a community that knows the best stories are never written alone.',
    discord: 'Join the community',
    footer: 'One city. Endless possibilities.',
    loading: 'Loading the city',
    loadingBody: 'We are arranging the final details before opening the gate.',
    emptyTitle: 'The city is quiet',
    emptyBody: 'Nothing has been published in this section yet. Check back soon.',
    errorTitle: 'The city is out of reach',
    errorBody: 'There is a temporary problem reaching published content.',
    retry: 'Try again',
    jobsTitle: 'Every career opens a story',
    jobsBody: 'Start where you feel at home, then write the rest your way.',
    newsTitle: 'News from the streets',
    newsBody: 'Community updates, city stories, and what deserves your attention.',
    rulesTitle: 'Play seriously. Live freely.',
    rulesBody: 'Clear rules protect the space for everyone and leave room for imagination.',
    storeTitle: 'Things worth owning',
    storeBody: 'Prime RP picks that give your presence a signature.',
    price: 'Price',
    published: 'Published',
    category: 'Category',
    adminTitle: 'Control room',
    adminBody: 'A private entrance for the Prime RP team. The admin console is coming here soon.',
    email: 'Email address',
    password: 'Password',
    signIn: 'Sign in',
    protected: 'Protected space',
    placeholder: 'This is a polished placeholder for the admin console entry.',
    status: 'Service status',
    online: 'Online',
  },
} as const;

function isArabic(locale: Locale) {
  return locale === 'ar';
}

function localized<T extends object>(item: T, locale: Locale, key: string) {
  const value = (item as Record<string, unknown>)[`${key}${locale === 'ar' ? 'Ar' : 'En'}`];
  return typeof value === 'string' ? value : '';
}

function Mark({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <Link href={`/${locale}`} className={`flex items-center gap-3 ${compact ? 'scale-90 origin-left' : ''}`} data-testid="link-brand">
      <img src="/prime-rp-logo.png" alt="Prime RP" className="h-12 w-auto object-contain" />
      <span className="hidden text-[10px] font-mono-ui uppercase tracking-[0.28em] text-foreground/50 sm:block">Roleplay city</span>
    </Link>
  );
}

function LocaleSwitch({ locale }: { locale: Locale }) {
  const other = locale === 'ar' ? 'en' : 'ar';
  const path = typeof window !== 'undefined' ? window.location.pathname : `/${locale}`;
  const nextPath = path.replace(/^\/(ar|en)/, `/${other}`);
  return (
    <Link href={nextPath || `/${other}`} className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/65 transition-colors hover:text-primary" data-testid="link-locale-switch">
      <Globe2 className="h-4 w-4 text-primary transition-transform group-hover:rotate-12" />
      <span>{other === 'ar' ? 'العربية' : 'English'}</span>
    </Link>
  );
}

function Header({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const nav = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/jobs`, label: t.jobs },
    { href: `/${locale}/news`, label: t.news },
    { href: `/${locale}/rules`, label: t.rules },
    { href: `/${locale}/store`, label: t.store },
  ];
  return (
    <header className="relative z-40 border-b hairline bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Mark locale={locale} />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-foreground/60 transition-colors hover:text-foreground" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <LocaleSwitch locale={locale} />
          <Link href={`/${locale}/jobs`} className="group flex items-center gap-2 border border-primary/50 bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.13em] text-primary-foreground transition-all hover:bg-primary/90" data-testid="link-enter-city">
            {t.enter}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <button type="button" className="border border-border p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={t.menu} data-testid="button-mobile-menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t hairline bg-card px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b hairline pb-3 text-sm text-foreground/75" data-testid={`link-mobile-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex items-center justify-between">
            <LocaleSwitch locale={locale} />
            <Link href={`/${locale}/jobs`} className="bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground" onClick={() => setOpen(false)} data-testid="link-mobile-enter-city">{t.enter}</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <footer className="mt-24 border-t hairline">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-5 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <Mark locale={locale} compact />
          <p className="mt-4 max-w-xs text-sm leading-7 text-foreground/50">{t.footer}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-foreground/45">
          <Link href={`/${locale}/jobs`} className="transition-colors hover:text-primary" data-testid="link-footer-jobs">{t.jobs}</Link>
          <Link href={`/${locale}/news`} className="transition-colors hover:text-primary" data-testid="link-footer-news">{t.news}</Link>
          <Link href={`/${locale}/rules`} className="transition-colors hover:text-primary" data-testid="link-footer-rules">{t.rules}</Link>
          <Link href={`/${locale}/store`} className="transition-colors hover:text-primary" data-testid="link-footer-store">{t.store}</Link>
          <Link href="/admin/login" className="transition-colors hover:text-primary" data-testid="link-footer-admin">{t.admin}</Link>
        </div>
      </div>
      <div className="border-t hairline py-4 text-center text-[10px] font-mono-ui uppercase tracking-[0.25em] text-foreground/30">PRIME RP / EST. 2024</div>
    </footer>
  );
}

function PageFrame({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = copy[locale];
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = t.dir;
  }, [locale, t.dir]);
  return (
    <div dir={t.dir} className="min-h-[100dvh] overflow-hidden bg-background">
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </div>
  );
}

function DataState({ locale, error, isLoading, isEmpty, children, onRetry }: { locale: Locale; error?: boolean; isLoading?: boolean; isEmpty?: boolean; children?: ReactNode; onRetry?: () => void }) {
  const t = copy[locale];
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
        <div className="mb-10 h-5 w-36 animate-pulse bg-secondary" />
        <div className="h-16 w-2/3 animate-pulse bg-secondary/70" />
        <div className="mt-4 h-5 w-1/2 animate-pulse bg-secondary/50" />
        <div className="mt-16 grid gap-4 md:grid-cols-3"><div className="h-56 animate-pulse bg-card" /><div className="h-56 animate-pulse bg-card" /><div className="h-56 animate-pulse bg-card" /></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-28 text-center lg:px-10">
        <CircleAlert className="h-10 w-10 text-primary" />
        <h2 className="mt-5 text-2xl font-bold">{t.errorTitle}</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{t.errorBody}</p>
        <button type="button" onClick={onRetry} className="mt-7 flex items-center gap-2 border border-primary/50 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground" data-testid="button-retry-content">
          <RefreshCw className="h-4 w-4" /> {t.retry}
        </button>
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-28 text-center lg:px-10">
        <Compass className="h-10 w-10 text-primary/80" />
        <h2 className="mt-5 text-2xl font-bold">{t.emptyTitle}</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{t.emptyBody}</p>
      </div>
    );
  }
  return <>{children}</>;
}

function usePublicContent() {
  const query = useGetPublicContent({ query: { queryKey: getGetPublicContentQueryKey(), staleTime: 30_000, retry: 1 } });
  return { ...query, content: query.data as PublicContent | undefined };
}

function HomePage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const { content, isLoading, isError, refetch } = usePublicContent();
  const jobs = content?.jobs ?? [];
  const news = content?.news ?? [];
  const products = content?.products ?? [];
  const stats = content?.stats;
  const latest = news.slice(0, 3);
  const featuredJobs = jobs.slice(0, 4);
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  return (
    <PageFrame locale={locale}>
      <main>
        <section className="relative isolate border-b hairline">
          <div className="absolute inset-0 grid-lines opacity-60" />
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />
          <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-32 lg:pt-28">
            <div className="animate-rise">
              <div className="mb-7 flex items-center gap-3 text-xs font-mono-ui uppercase tracking-[0.25em] text-primary"><span className="line-pulse h-px w-10 bg-primary" /> {t.heroEyebrow}</div>
              <h1 className="max-w-4xl text-balance text-5xl font-extrabold leading-[1.08] tracking-[-0.06em] text-foreground sm:text-7xl lg:text-[clamp(4.5rem,8vw,8rem)]">{t.heroTitle}</h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">{t.heroBody}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href={`/${locale}/jobs`} className="group flex items-center gap-3 bg-primary px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-hero-explore">
                  {t.explore}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link href={`/${locale}/rules`} className="flex items-center gap-3 border border-border px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:border-primary/60 hover:text-primary" data-testid="link-hero-rules">
                  {t.rulesCta}<ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative animate-rise delay-2">
              <div className="absolute -left-4 -top-4 h-20 w-20 border-l border-t border-primary/60" />
              <div className="surface relative min-h-[390px] overflow-hidden border hairline p-7 sm:min-h-[480px] sm:p-10">
                <div className="absolute right-0 top-0 h-48 w-48 bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-56 w-56 bg-accent/5 blur-3xl" />
                <div className="relative flex h-full min-h-[330px] flex-col justify-between sm:min-h-[400px]">
                  <div className="flex items-start justify-between">
                    <div className="text-[10px] font-mono-ui uppercase tracking-[0.25em] text-foreground/40">01 / PRIME CITY</div>
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-6xl font-extrabold tracking-[-0.07em] text-foreground/90 sm:text-8xl">PRIME</p>
                    <div className="mt-2 flex items-center gap-3"><div className="h-px flex-1 bg-primary/60" /><span className="font-mono-ui text-xs text-primary">RP</span></div>
                    <p className="mt-5 max-w-xs text-sm leading-7 text-foreground/50">{t.liveBody}</p>
                  </div>
                  <div className="flex items-end justify-between border-t hairline pt-5">
                    <div><div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">{t.live}</div><div className="mt-2 flex items-center gap-2 text-xs text-accent"><span className="h-2 w-2 rounded-full bg-accent" /> {t.online}</div></div>
                    <div className="font-mono-ui text-4xl font-medium text-primary/80">24:7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <DataState locale={locale} isLoading={isLoading} error={isError} onRetry={() => void refetch()}>
          <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono-ui uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> 02 / {t.latest}</div>
                <h2 className="mt-5 max-w-md text-4xl font-extrabold leading-tight tracking-[-0.05em] sm:text-5xl">{t.latest}</h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">{t.latestBody}</p>
                <Link href={`/${locale}/news`} className="mt-8 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.15em] text-primary" data-testid="link-home-news">{t.seeAll}<ArrowUpRight className="h-4 w-4" /></Link>
              </div>
              <div className="space-y-3">
                {latest.length === 0 ? <DataState locale={locale} isEmpty /> : latest.map((item, index) => <NewsRow key={item.id} item={item} locale={locale} index={index} />)}
              </div>
            </div>
          </section>
          <section className="border-y hairline bg-card/30">
            <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div><div className="flex items-center gap-3 text-xs font-mono-ui uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> 03 / {t.careers}</div><h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">{t.careers}</h2><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{t.careersBody}</p></div>
                <Link href={`/${locale}/jobs`} className="group flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-primary" data-testid="link-home-jobs">{t.viewJobs}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
              </div>
              {featuredJobs.length === 0 ? <DataState locale={locale} isEmpty /> : <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{featuredJobs.map((job, index) => <JobCard key={job.id} job={job} locale={locale} index={index} />)}</div>}
            </div>
          </section>
          <section className="relative mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
              <div className="relative border border-primary/25 bg-primary/[.04] p-8 sm:p-12"><div className="absolute -bottom-3 -right-3 h-14 w-14 border-b border-r border-primary/60" /><Scale className="h-9 w-9 text-primary" /><h2 className="mt-7 max-w-lg text-4xl font-extrabold leading-tight tracking-[-0.05em] sm:text-5xl">{t.protocol}</h2><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">{t.protocolBody}</p><Link href={`/${locale}/rules`} className="mt-8 inline-flex items-center gap-3 border-b border-primary pb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-primary" data-testid="link-home-rules">{t.readRules}<ArrowRight className="h-4 w-4" /></Link></div>
              <div><div className="flex items-center gap-3 text-xs font-mono-ui uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> 04 / {t.numbers}</div><h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">{t.numbers}</h2><p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">{t.numbersBody}</p><div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border">{[['jobs', t.jobs], ['news', t.news], ['rules', t.rules], ['products', t.store]].map(([key, label]) => <div key={key} className="bg-background p-5"><div className="font-mono-ui text-3xl font-medium text-primary">{stats?.[key as keyof typeof stats] ?? '—'}</div><div className="mt-2 text-xs uppercase tracking-[0.16em] text-foreground/45">{label}</div></div>)}</div></div>
            </div>
          </section>
          <section className="border-t hairline bg-card/25"><div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="flex items-center gap-3 text-xs font-mono-ui uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> 05 / {t.featured}</div><h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">{t.featured}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{t.featuredBody}</p></div><Link href={`/${locale}/store`} className="group flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-primary" data-testid="link-home-store">{t.viewStore}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div>{featuredProducts.length === 0 ? <DataState locale={locale} isEmpty /> : <div className="mt-12 grid gap-3 md:grid-cols-3">{featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} locale={locale} index={index} />)}</div>}</div></section>
          <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="relative overflow-hidden border border-accent/20 bg-accent/[.04] px-7 py-14 text-center sm:px-12"><div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-accent/10 blur-3xl" /><Sparkles className="relative mx-auto h-8 w-8 text-accent" /><h2 className="relative mt-6 text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">{t.community}</h2><p className="relative mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">{t.communityBody}</p><a href="https://discord.com" target="_blank" rel="noreferrer" className="relative mt-8 inline-flex items-center gap-3 border border-accent/50 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground" data-testid="link-community">{t.discord}<ArrowUpRight className="h-4 w-4" /></a></div></section>
        </DataState>
      </main>
    </PageFrame>
  );
}

function NewsRow({ item, locale, index }: { item: NewsPost; locale: Locale; index: number }) {
  const title = localized(item, locale, 'title');
  const excerpt = localized(item, locale, 'excerpt');
  const date = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(item.createdAt));
  return <article className="group grid gap-4 border-t hairline py-6 sm:grid-cols-[100px_1fr_24px] sm:items-center"><div className="font-mono-ui text-xs text-primary/80">0{index + 1} / {date}</div><div><h3 className="text-lg font-bold transition-colors group-hover:text-primary">{title}</h3><p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">{excerpt}</p></div><ArrowUpRight className="h-5 w-5 text-foreground/30 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" /></article>;
}

function JobCard({ job, locale, index }: { job: Job; locale: Locale; index: number }) {
  const icons = [BriefcaseBusiness, Building2, Headphones, Landmark];
  const Icon = icons[index % icons.length];
  return <article className="group surface relative overflow-hidden border hairline p-6 transition-transform hover:-translate-y-1"><div className="flex items-start justify-between"><Icon className="h-7 w-7 text-primary" /><span className="font-mono-ui text-xs text-foreground/30">0{index + 1}</span></div><h3 className="mt-16 text-xl font-bold">{localized(job, locale, 'title')}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{localized(job, locale, 'description')}</p><div className="mt-6 h-px w-10 bg-primary transition-all group-hover:w-full" /></article>;
}

function ProductCard({ product, locale, index }: { product: Product; locale: Locale; index: number }) {
  return <article className="surface group border hairline p-6"><div className="flex items-start justify-between"><ShoppingBag className="h-6 w-6 text-primary" /><span className="font-mono-ui text-xs text-foreground/30">0{index + 1}</span></div><h3 className="mt-12 text-xl font-bold">{localized(product, locale, 'name')}</h3><p className="mt-3 min-h-14 text-sm leading-7 text-muted-foreground">{localized(product, locale, 'description')}</p><div className="mt-7 flex items-center justify-between border-t hairline pt-5"><span className="font-mono-ui text-sm text-primary">{product.price.toFixed(2)} {product.currency}</span><span className="text-[10px] uppercase tracking-[0.16em] text-foreground/35">{locale === 'ar' ? 'مختار' : 'Featured'}</span></div></article>;
}

function ListingPage({ locale, kind }: { locale: Locale; kind: 'jobs' | 'news' | 'rules' | 'store' }) {
  const t = copy[locale];
  const { content, isLoading, isError, refetch } = usePublicContent();
  const meta = { jobs: [t.jobsTitle, t.jobsBody, BriefcaseBusiness], news: [t.newsTitle, t.newsBody, Newspaper], rules: [t.rulesTitle, t.rulesBody, ShieldCheck], store: [t.storeTitle, t.storeBody, Store] } as const;
  const [title, body, Icon] = meta[kind];
  const values: Array<Job | NewsPost | Rule | Product> = kind === 'store' ? (content?.products ?? []) : kind === 'jobs' ? (content?.jobs ?? []) : kind === 'news' ? (content?.news ?? []) : (content?.rules ?? []);
  return <PageFrame locale={locale}><main><section className="relative border-b hairline"><div className="absolute inset-0 grid-lines opacity-45" /><div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28"><div className="flex items-center gap-3 text-xs font-mono-ui uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> 0{kind === 'jobs' ? 1 : kind === 'news' ? 2 : kind === 'rules' ? 3 : 4} / PRIME RP</div><div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><h1 className="max-w-4xl text-5xl font-extrabold tracking-[-0.06em] sm:text-7xl">{title}</h1><p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">{body}</p></div><Icon className="hidden h-16 w-16 text-primary/80 md:block" /></div></div></section><DataState locale={locale} isLoading={isLoading} error={isError} onRetry={() => void refetch()} isEmpty={!isLoading && !isError && values.length === 0}><section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">{kind === 'jobs' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(values as Job[]).map((job, index) => <JobCard key={job.id} job={job} locale={locale} index={index} />)}</div>}{kind === 'news' && <div className="mx-auto max-w-4xl">{(values as NewsPost[]).map((item, index) => <NewsRow key={item.id} item={item} locale={locale} index={index} />)}</div>}{kind === 'rules' && <div className="mx-auto max-w-4xl space-y-10">{(values as Rule[]).map((rule, index) => <RuleBlock key={rule.id} rule={rule} locale={locale} index={index} />)}</div>}{kind === 'store' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(values as Product[]).map((product, index) => <ProductCard key={product.id} product={product} locale={locale} index={index} />)}</div>}</section></DataState></main></PageFrame>;
}

function RuleBlock({ rule, locale, index }: { rule: Rule; locale: Locale; index: number }) {
  return <article className="grid gap-5 border-t hairline pt-7 sm:grid-cols-[110px_1fr]"><div className="font-mono-ui text-xs text-primary">0{index + 1} / {rule.category}</div><div><h2 className="text-2xl font-bold tracking-[-0.03em]">{localized(rule, locale, 'title')}</h2><p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">{localized(rule, locale, 'content')}</p></div></article>;
}

function AdminLogin() {
  const locale: Locale = 'en';
  const t = copy[locale];
  const [submitted, setSubmitted] = useState(false);
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), retry: 0, staleTime: 30_000 } });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return <PageFrame locale={locale}><main className="relative flex min-h-[calc(100dvh-76px)] items-center justify-center px-5 py-20"><div className="absolute inset-0 grid-lines opacity-50" /><div className="relative grid w-full max-w-5xl overflow-hidden border hairline bg-card/70 lg:grid-cols-[.9fr_1.1fr]"><div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex"><div><LockKeyhole className="h-8 w-8" /><p className="mt-20 text-[10px] font-mono-ui uppercase tracking-[0.25em]">PRIME RP / CONTROL ROOM</p><h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-[-0.06em]">{t.adminTitle}</h1></div><div><div className="h-px w-16 bg-primary-foreground/60" /><p className="mt-4 text-sm leading-7 text-primary-foreground/70">{t.adminBody}</p></div></div><div className="p-7 sm:p-12"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-xs font-mono-ui uppercase tracking-[0.2em] text-primary"><KeyRound className="h-4 w-4" /> {t.protected}</div><h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em]">{t.signIn}</h2></div><Link href="/en" className="text-xs text-foreground/45 hover:text-primary" data-testid="link-admin-back">{t.home}</Link></div><form className="mt-10 space-y-5" onSubmit={submit}><label className="block"><span className="mb-2 block text-xs uppercase tracking-[0.15em] text-foreground/45">{t.email}</span><input type="email" required placeholder="team@primerp.com" className="w-full border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary" data-testid="input-admin-email" /></label><label className="block"><span className="mb-2 block text-xs uppercase tracking-[0.15em] text-foreground/45">{t.password}</span><input type="password" required placeholder="••••••••" className="w-full border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary" data-testid="input-admin-password" /></label><button type="submit" className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-xs font-extrabold uppercase tracking-[0.17em] text-primary-foreground transition-colors hover:bg-primary/90" data-testid="button-admin-submit">{t.signIn}<ArrowRight className="h-4 w-4" /></button></form>{submitted && <div className="mt-5 border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-foreground/70" data-testid="status-admin-placeholder">{t.placeholder}</div>}<div className="mt-10 flex items-center justify-between border-t hairline pt-5 text-[10px] font-mono-ui uppercase tracking-[0.15em] text-foreground/35"><span>{t.status}</span><span className="flex items-center gap-2 text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{health.isError ? 'Unavailable' : t.online}</span></div></div></div></main></PageFrame>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/ar" component={() => <HomePage locale="ar" />} /><Route path="/en" component={() => <HomePage locale="en" />} /><Route path="/ar/jobs" component={() => <ListingPage locale="ar" kind="jobs" />} /><Route path="/en/jobs" component={() => <ListingPage locale="en" kind="jobs" />} /><Route path="/ar/news" component={() => <ListingPage locale="ar" kind="news" />} /><Route path="/en/news" component={() => <ListingPage locale="en" kind="news" />} /><Route path="/ar/rules" component={() => <ListingPage locale="ar" kind="rules" />} /><Route path="/en/rules" component={() => <ListingPage locale="en" kind="rules" />} /><Route path="/ar/store" component={() => <ListingPage locale="ar" kind="store" />} /><Route path="/en/store" component={() => <ListingPage locale="en" kind="store" />} /><Route path="/admin/login" component={AdminLogin} /><Route path="/" component={() => <HomePage locale="en" />} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;