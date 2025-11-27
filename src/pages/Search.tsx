import { useSearchParams } from "react-router-dom";
import { getAllPosts } from "../lib/content";
import { tokens, makeStyles, Input, Button } from "@fluentui/react-components";
import { Search24Regular } from "@fluentui/react-icons";
import PostCard from "../components/PostCard";
import { useState } from "react";

const useStyles = makeStyles({
  searchWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "32px 0 40px 0",
    width: "100%",
    maxWidth: "600px",
    minWidth: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  searchRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    width: "100%",
    maxWidth: "500px",
  },
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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const q = input.trim().toLowerCase();
  const styles = useStyles();
  const all = getAllPosts();
  const posts = q
    ? all.filter((p) => {
        const t = p.title.toLowerCase();
        const s = (p.summary || "").toLowerCase();
        return t.includes(q) || s.includes(q);
      })
    : all;

  const handleInput = (_: unknown, data: { value: string }) => {
    setInput(data.value);
  };

  const handleSearch = () => {
    setSearchParams(input ? { q: input } : {});
  };

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
    <>
      <div className={styles.searchWrap}>
        <form
          className={styles.searchRow}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input
            value={input}
            onChange={handleInput}
            placeholder="搜索文章..."
            aria-label="搜索"
            style={{ flex: 1 }}
          />
          <Button
            type="submit"
            appearance="primary"
            icon={<Search24Regular />}
            aria-label="搜索"
          />
        </form>
      </div>
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
    </>
  );
}
