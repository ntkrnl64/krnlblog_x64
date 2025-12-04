import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "../contexts/ThemeContext";

type GiscusConfig = {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
};

export default function GiscusComments() {
  const [config, setConfig] = useState<GiscusConfig | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/config.json");
        const data = await response.json();
        if (data.giscus) {
          setConfig(data.giscus);
        }
      } catch (error) {
        console.error("Failed to fetch Giscus config:", error);
      }
    };

    fetchConfig();
  }, []);

  if (!config) {
    return <div>Loading comments...</div>;
  }

  return (
    <div style={{ marginTop: 48 }}>
      <Giscus
        repo={config.repo}
        repoId={config.repoId}
        category={config.category}
        categoryId={config.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={isDark ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
