import { Title2, tokens, makeStyles } from "@fluentui/react-components";
import { getPostBySlug } from "../lib/content";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { highlightAllCodeBlocks } from "../lib/highlight";
import NotFound from "./NotFound.tsx";
import { useToc } from "../contexts/TocContext";

const useStyles = makeStyles({
  article: {
    maxWidth: "760px",
    margin: "0 auto",
    lineHeight: 1.8,
    fontSize: "16px",
    boxSizing: "border-box",
    width: "100%",
    "@media (max-width: 900px)": {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
      fontSize: "15px",
    },
    "@media (max-width: 600px)": {
      paddingLeft: tokens.spacingHorizontalS,
      paddingRight: tokens.spacingHorizontalS,
      fontSize: "14px",
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      display: "block",
      margin: "0 auto",
    },
    "& pre": {
      overflowX: "auto",
      padding: tokens.spacingHorizontalM,
      backgroundColor: tokens.colorNeutralBackground2,
      borderRadius: tokens.borderRadiusMedium,
      fontSize: "13px",
      wordBreak: "break-all",
    },
    "& table": {
      width: "100%",
      display: "block",
      overflowX: "auto",
      borderCollapse: "collapse",
      marginTop: tokens.spacingVerticalM,
      marginBottom: tokens.spacingVerticalM,
    },
    "& th, & td": {
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: tokens.spacingHorizontalS,
    },
    "& th": {
      backgroundColor: tokens.colorNeutralBackground2,
      fontWeight: 600,
    },
    "& .mobile-toc": {
      "@media (max-width: 768px)": {
        display: "block !important",
      },
    },
  },
});

export default function Post() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<{
    html: string;
    title?: string;
    summary?: string;
    publishedAt?: string;
    tags?: string[];
    group?: string;
  } | null>(null);
  const styles = useStyles();
  const articleRef = useRef<HTMLDivElement>(null);
  const { setToc } = useToc();

  useEffect(() => {
    const loadPost = () => {
      const p = getPostBySlug(slug);
      setPost(p ?? null);
      if (p?.title) {
        const blogName = document.title.split(" - ").pop() || "";
        document.title = `${p.title} - ${blogName}`;
      }
    };
    loadPost();
  }, [slug]);

  // 生成目录和带锚点的 html
  const { toc, htmlWithAnchors } = useMemo(() => {
    if (!post?.html) return { toc: [], htmlWithAnchors: post?.html || "" };
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.html, "text/html");
    const headings = Array.from(doc.body.querySelectorAll("h2, h3, h4"));
    const toc: { id: string; text: string; level: number }[] = [];
    headings.forEach((el, idx) => {
      const text = el.textContent || "";
      const id =
        text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-_]/g, "") || `section-${idx}`;
      let uniq = id,
        n = 1;
      while (doc.getElementById(uniq)) {
        uniq = id + "-" + n++;
      }
      el.id = uniq;
      toc.push({ id: uniq, text, level: Number(el.tagName[1]) });
    });
    return { toc, htmlWithAnchors: doc.body.innerHTML };
  }, [post]);

  useEffect(() => {
    if (articleRef.current) {
      highlightAllCodeBlocks(articleRef.current);
    }
  }, [htmlWithAnchors]);

  // 设置目录到侧边栏
  useEffect(() => {
    setToc(toc);
    return () => setToc([]);
  }, [toc, setToc]);

  if (!post) return <NotFound />;

  return (
    <div className={styles.article} ref={articleRef}>
      <Title2>{post.title}</Title2>

      {/* 手机端显示目录 */}
      {toc.length > 0 && (
        <nav
          style={{
            margin: "16px 0",
            padding: "12px 16px",
            background: tokens.colorNeutralBackground3,
            borderRadius: 8,
            fontSize: 15,
            display: "none",
          }}
          className="mobile-toc"
        >
          <b style={{ fontSize: 15, color: tokens.colorBrandForeground1 }}>
            📑 目录
          </b>
          <ul style={{ margin: "8px 0 0 0", padding: 0, listStyle: "none" }}>
            {toc.map((item) => (
              <li
                key={item.id}
                style={{ marginLeft: (item.level - 2) * 16, marginTop: 4 }}
              >
                <a
                  href={`#${item.id}`}
                  style={{
                    color: tokens.colorBrandForeground2,
                    textDecoration: "underline",
                    fontSize: 14,
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {post.group && (
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <a
            href={`/group/${encodeURIComponent(post.group)}`}
            style={{
              color: tokens.colorBrandForeground1,
              fontSize: 14,
              textDecoration: "underline",
            }}
          >
            📁 分组：{post.group}
          </a>
        </div>
      )}
      {post.tags && post.tags.length > 0 && (
        <div
          style={{
            marginTop: 8,
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {post.tags.map((tag: string) => (
            <a
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              style={{
                color: tokens.colorBrandForeground2,
                fontSize: 13,
                background: tokens.colorNeutralBackground3,
                borderRadius: 4,
                padding: "2px 10px",
                textDecoration: "none",
              }}
            >
              #{tag}
            </a>
          ))}
        </div>
      )}
      <div
        style={{ marginTop: tokens.spacingVerticalL }}
        dangerouslySetInnerHTML={{ __html: htmlWithAnchors }}
      />
    </div>
  );
}
