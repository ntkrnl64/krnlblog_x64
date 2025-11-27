import { useParams } from "react-router-dom";
import { getAllPosts } from "../lib/content";
import { Title2, tokens, makeStyles } from "@fluentui/react-components";
import PostCard from "../components/PostCard";

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

const formatDate = (s?: string): string => {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
};

export default function Group() {
  const { groupName } = useParams();
  const styles = useStyles();
  const posts = getAllPosts().filter((p) => p.group === groupName);

  return (
    <div>
      <Title2 style={{ marginBottom: 20 }}>📁 分组：{groupName}</Title2>
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
    </div>
  );
}
