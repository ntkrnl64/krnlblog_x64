import {
  Card,
  Title3,
  Body1,
  tokens,
  makeStyles,
} from "@fluentui/react-components";
import type { PostMeta } from "../lib/content";

const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: tokens.shadow16,
    },
    "@media (max-width: 600px)": {
      gap: tokens.spacingVerticalS,
    },
  },
  titleText: {
    wordBreak: "break-word",
    fontWeight: 600,
  },
  summaryText: {
    wordBreak: "break-word",
    color: tokens.colorNeutralForeground3,
  },
  footerRow: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: tokens.colorNeutralForeground3,
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: tokens.spacingVerticalS,
    },
  },
  readMore: {
    color: tokens.colorBrandForeground1,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
  },
});

interface PostCardProps {
  post: PostMeta;
  showDate?: boolean;
  showReadMore?: boolean;
  formatDate?: (date?: string) => string;
}

export default function PostCard({
  post,
  showDate = false,
  showReadMore = false,
  formatDate,
}: PostCardProps) {
  const styles = useStyles();
  const dateStr =
    showDate && post.publishedAt
      ? formatDate
        ? formatDate(post.publishedAt)
        : post.publishedAt
      : "";

  return (
    <a
      href={`/post/${post.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
      tabIndex={0}
    >
      <Card className={styles.card} tabIndex={-1}>
        <Title3 className={styles.titleText}>{post.title}</Title3>
        {post.summary && (
          <Body1 className={styles.summaryText}>{post.summary}</Body1>
        )}
        {(showDate || showReadMore) && (
          <div className={styles.footerRow}>
            {showDate ? <span>{dateStr}</span> : <span />}
            {showReadMore ? (
              <span className={styles.readMore}>阅读更多 →</span>
            ) : null}
          </div>
        )}
      </Card>
    </a>
  );
}
