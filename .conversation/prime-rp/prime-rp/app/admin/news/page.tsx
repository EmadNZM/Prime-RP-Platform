import Link from "next/link";
import "./admin.css";
import { requireAdmin } from "@/lib/guards";
import { db } from "@/lib/db";
import { createNews, toggleNews } from "./actions";

export default async function NewsAdminPage() {
  await requireAdmin(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const posts = await db.newsPost.findMany({ orderBy: { createdAt: "desc" } });
  return <main className="admin-shell"><section className="admin-main admin-content"><div className="admin-top"><div className="admin-title"><h1>News management</h1><p>Create bilingual updates and control publication.</p></div><Link className="btn" href="/admin/dashboard">Dashboard</Link></div>
    <form action={createNews} className="admin-form"><input name="slug" placeholder="slug (e.g. season-one)" required /><input name="titleAr" placeholder="العنوان العربي" required /><input name="titleEn" placeholder="English title" required /><textarea name="excerptAr" placeholder="ملخص عربي" /><textarea name="excerptEn" placeholder="English summary" /><textarea name="contentAr" placeholder="المحتوى العربي" required /><textarea name="contentEn" placeholder="English content" required /><label><input name="published" type="checkbox" /> Publish immediately</label><button className="btn btn-primary" type="submit">Create news post</button></form>
    <div className="table-wrap"><table><thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Action</th></tr></thead><tbody>{posts.map(post => <tr key={post.id}><td>{post.titleEn}<br /><small>{post.titleAr}</small></td><td>{post.slug}</td><td><span className="pill">{post.published ? "Published" : "Draft"}</span></td><td><form action={toggleNews}><input type="hidden" name="id" value={post.id}/><input type="hidden" name="published" value={String(post.published)}/><button className="btn" type="submit">{post.published ? "Unpublish" : "Publish"}</button></form></td></tr>)}</tbody></table></div>
  </section></main>;
}
