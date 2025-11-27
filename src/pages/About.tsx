import { useEffect, useState } from "react";
import { getPostBySlug } from "../lib/content";
import RenderedPage from "../components/RenderedPage";

export default function About() {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const loadAbout = () => {
      const post = getPostBySlug("about");
      if (post) {
        setHtml(post.html);
      } else {
        setHtml("<p>请在 content/about.md 中撰写关于页面内容。</p>");
      }
    };
    loadAbout();
  }, []);

  return <RenderedPage html={html} />;
}
