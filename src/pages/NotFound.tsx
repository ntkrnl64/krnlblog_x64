import RenderedPage from "../components/RenderedPage";
import { getPostBySlug } from "../lib/content";

export default function NotFound() {
  const notFound = getPostBySlug("NOT_FOUND") || getPostBySlug("not_found");
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <RenderedPage
        html={
          notFound?.html ||
          '<h2>404 - 页面未找到</h2><p>您访问的页面不存在。</p><p><a href="/">返回首页</a></p>'
        }
      />
    </div>
  );
}
