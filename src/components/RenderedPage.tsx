import { tokens, makeStyles } from "@fluentui/react-components";
import { useEffect, useRef } from "react";
import { highlightAllCodeBlocks } from "../lib/highlight";

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
  },
});

export type RenderedPageProps = {
  html: string;
};

export default function RenderedPage({ html }: RenderedPageProps) {
  const styles = useStyles();
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (articleRef.current) {
      highlightAllCodeBlocks(articleRef.current);
    }
  }, [html]);

  return (
    <div className={styles.article} ref={articleRef}>
      <div
        style={{ marginTop: tokens.spacingVerticalM }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
