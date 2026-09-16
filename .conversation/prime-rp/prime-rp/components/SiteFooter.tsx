import Link from "next/link";
import { copy, Locale } from "@/lib/i18n";
export function SiteFooter({locale}:{locale:Locale}){const t=copy[locale];return <footer className="footer"><div className="container footer-grid"><div><strong>PRIME RP</strong><div style={{marginTop:8}}>{t.footer}</div></div><div style={{display:"flex",gap:18}}><Link href={`/${locale}/rules`}>{t.rules}</Link><Link href={`/${locale}/jobs`}>{t.jobs}</Link><a href="https://discord.com" target="_blank">Discord</a></div></div></footer>}
