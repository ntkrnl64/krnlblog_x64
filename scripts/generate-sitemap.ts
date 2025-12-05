import fs from "fs";
import path from "path";
import { create } from 'xmlbuilder2';
import glob from "glob";
import matter from "gray-matter";
import config from "../public/config.json";

type PostMeta = {
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  tags?: string[];
  group?: string;
  type?: "post" | "notice" | "page" | "";
};

async function generate() {
  const contentDir = path.resolve(__dirname, "../content");
  const files = glob.sync("*.md", { cwd: contentDir });
  const posts: PostMeta[] = [];
  const pages: PostMeta[] = [];
  const tags = new Set<string>();
  const groups = new Set<string>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data } = matter(raw);
    const type = (data.type ?? "").toLowerCase();

    const postTags = Array.isArray(data.tags) ? data.tags.map(String) : typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : [];
    postTags.forEach(t => tags.add(t));
    if (data.group) {
        groups.add(String(data.group));
    }

    const slug = String(data.slug ?? file.replace(".md", ""));
    
    const meta: PostMeta = {
      slug,
      title: String(data.title ?? slug),
      summary: data.summary ? String(data.summary) : undefined,
      publishedAt: data.publishedAt ? String(data.publishedAt) : undefined,
      tags: postTags,
      group: data.group ? String(data.group) : undefined,
      type: type === "page" ? "page" : "post",
    };

    if (meta.type === "page") {
      pages.push(meta);
    } else {
      posts.push(meta);
    }
  }

  // URLs for sitemap
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = [];

  // Static Pages
  urls.push({ loc: `${config.siteUrl}/`, changefreq: "daily", priority: 1.0 });
  urls.push({ loc: `${config.siteUrl}/archive`, changefreq: "weekly", priority: 0.8 });
  urls.push({ loc: `${config.siteUrl}/about`, changefreq: "monthly", priority: 0.7 });

  // Content Pages
  pages.forEach(page => {
    urls.push({ loc: `${config.siteUrl}/page/${page.slug}`, changefreq: "monthly", priority: 0.7 });
  });

  // Blog Posts
  posts.forEach(post => {
    if (post.publishedAt) {
      urls.push({
        loc: `${config.siteUrl}/post/${post.slug}`,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date(post.publishedAt).toISOString(),
      });
    }
  });

  // Tag Pages
  tags.forEach(tag => {
    urls.push({ loc: `${config.siteUrl}/tag/${encodeURIComponent(tag)}`, changefreq: 'weekly', priority: 0.6 });
  });

  // Group Pages
  groups.forEach(group => {
    urls.push({ loc: `${config.siteUrl}/group/${encodeURIComponent(group)}`, changefreq: 'weekly', priority: 0.6 });
  });

  // Build XML
  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

  urls.forEach(url => {
    const urlElement = root.ele('url').ele('loc').txt(url.loc).up();
    if (url.lastmod) urlElement.ele('lastmod').txt(url.lastmod).up();
    if (url.changefreq) urlElement.ele('changefreq').txt(url.changefreq).up();
    if (url.priority) urlElement.ele('priority').txt(url.priority.toString()).up();
  });

  const sitemapXml = root.end({ prettyPrint: true });
  fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), sitemapXml);

}

generate().catch(console.error);
