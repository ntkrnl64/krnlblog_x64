import { tokens, makeStyles } from "@fluentui/react-components";
import PostCard from "../components/PostCard";
import { getAllPosts } from "../lib/content";
import { useSearchParams } from "react-router-dom";

const useStyles = makeStyles({
  grid: {
    display: "grid",
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    alignItems: "stretch",
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

export default function Home() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const styles = useStyles();
  const all = getAllPosts().filter((p) => p.slug !== "about");
  const posts = q
    ? all.filter((p) => {
        const t = p.title.toLowerCase();
        const s = (p.summary || "").toLowerCase();
        return t.includes(q) || s.includes(q);
      })
    : all;

  // 日期格式化：将各种可解析的日期字符串格式化为 yyyy/mm/dd
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
    <div className={styles.grid}>
      {posts.map((p) => (
        <PostCard
          key={p.slug}
          post={p}
          showDate
          showReadMore
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
