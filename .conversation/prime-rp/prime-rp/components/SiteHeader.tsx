import Link from "next/link";
import Image from "next/image";
import { copy, Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy[locale]; const other = locale === "ar" ? "en" : "ar";
  return <header className="site-header"><div className="container nav">
    <Link className="brand" href={`/${locale}`}><Image src="/prime-rp-logo.png" alt="Prime RP" width={54} height={44}/><span>PRIME RP</span></Link>
    <nav className="navlinks"><Link href={`/${locale}`}>{t.home}</Link><a href={`/${locale}#about`}>{t.about}</a><Link href={`/${locale}/rules`}>{t.rules}</Link><Link href={`/${locale}/jobs`}>{t.jobs}</Link><Link href={`/${locale}/news`}>{t.news}</Link><Link href={`/${locale}/store`}>{t.store}</Link></nav>
    <div className="nav-actions"><Link className="locale" href={`/${other}`}>{other.toUpperCase()}</Link><Link className="btn btn-primary" href="/admin/login">{t.login}</Link></div>
  </div></header>
}
