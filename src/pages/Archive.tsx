import { Title2, Title3, tokens, makeStyles } from "@fluentui/react-components";
import PostCard from "../components/PostCard";
import { getAllPosts, type PostMeta } from "../lib/content";

const useStyles = makeStyles({
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  group: {
    marginTop: tokens.spacingVerticalXXL,
  },
  list: {
    marginTop: tokens.spacingVerticalL,
    display: "grid",
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    "@media (min-width: 1200px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    },
    "@media (max-width: 900px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    "@media (max-width: 600px)": {
      gridTemplateColumns: "1fr",
      gap: tokens.spacingHorizontalM,
    },
  },
});

function groupByMonth(
  posts: PostMeta[],
): Array<{ key: string; items: PostMeta[] }> {
  const groups: Record<string, PostMeta[]> = {};
  for (const p of posts) {
    let key = "未分组";
    if (p.publishedAt) {
      const d = new Date(p.publishedAt);
      if (!isNaN(d.getTime())) {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
    }
    (groups[key] ||= []).push(p);
  }
  const entries = Object.entries(groups)
    .sort(([a], [b]) => {
      if (a === "未分组") return 1;
      if (b === "未分组") return -1;
      return b.localeCompare(a);
    })
    .map(([key, items]) => ({ key, items }));
  return entries;
}

export default function Archive() {
  const styles = useStyles();
  const posts = getAllPosts();
  const groups = groupByMonth(posts);

  const formatDate = (s?: string): string => {
    if (!s) return "";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  };

  return (
    <div className={styles.container}>
      <Title2>📚 归档</Title2>
      {groups.map((g) => (
        <section key={g.key} className={styles.group}>
          <Title3>{g.key}</Title3>
          <div className={styles.list}>
            {g.items.map((p) => (
              <PostCard
                key={p.slug}
                post={p}
                showDate
                showReadMore
                formatDate={formatDate}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
