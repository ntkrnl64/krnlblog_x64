const fs = require("fs");
const path = require("path");
const RSS = require("rss");
const glob = require("glob");
const matter = require("gray-matter");
const config = require("../public/config.json");

async function generate() {
  const contentDir = path.resolve(__dirname, "../content");
  const files = glob.sync("*.md", { cwd: contentDir });

  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data } = matter(raw);
    const type = (data.type ?? "").toLowerCase();

    // Only include posts in the RSS feed
    if (type === "post" || !type) {
        const slug = String(data.slug ?? file.replace(".md", ""));
        const meta = {
            slug,
            title: String(data.title ?? slug),
            summary: data.summary ? String(data.summary) : undefined,
            publishedAt: data.publishedAt ? String(data.publishedAt) : undefined,
        };
        posts.push(meta);
    }
  }

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // RSS Feed
  const feed = new RSS({
    title: config.title,
    description: config.description,
    feed_url: `${config.siteUrl}/rss.xml`,
    site_url: config.siteUrl,
    image_url: `${config.siteUrl}${config.icon}`,
    managingEditor: `${config.author.email} (${config.author.name})`,
    webMaster: `${config.author.email} (${config.author.name})`,
    copyright: new Date().getFullYear() + " " + config.author.name,
    language: "en",
    pubDate: new Date().toUTCString(),
  });

  for (const post of posts) {
    if (!post.publishedAt) continue;
    feed.item({
      title: post.title,
      description: post.summary || "",
      url: `${config.siteUrl}/post/${post.slug}`,
      guid: post.slug,
      date: new Date(post.publishedAt),
      author: config.author.name,
    });
  }

  const xml = feed.xml({ indent: true });

  fs.writeFileSync(path.resolve(__dirname, "../public/rss.xml"), xml);

}

generate().catch(console.error);
