import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";

// 使用 Prism.js 进行代码高亮
export function highlightAllCodeBlocks(container: HTMLElement) {
  // 确保 DOM 已经渲染
  setTimeout(() => {
    const codeBlocks = container.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      highlightCodeBlock(block as HTMLElement);
    });
  }, 0);
}

function highlightCodeBlock(block: HTMLElement) {
  // 如果已经高亮过，跳过
  if (block.classList.contains("prism-highlighted")) {
    return;
  }

  const code = block.textContent || "";

  // 获取语言类型 - 从 code 元素或父 pre 元素
  let language = "";
  const codeClassMatch = block.className.match(/language-(\w+)/);
  const preClassMatch = block.parentElement?.className.match(/language-(\w+)/);

  if (codeClassMatch) {
    language = codeClassMatch[1];
  } else if (preClassMatch) {
    language = preClassMatch[1];
  }

  if (!language) {
    // 尝试从 marked 生成的 class 中获取
    const classes = block.className.split(" ");
    for (const cls of classes) {
      if (cls && cls !== "language-" && !cls.includes("token")) {
        language = cls.replace("language-", "");
        break;
      }
    }
  }

  // 语言别名映射
  const languageMap: { [key: string]: string } = {
    js: "javascript",
    ts: "typescript",
    html: "markup",
    xml: "markup",
    svg: "markup",
    sh: "bash",
    shell: "bash",
    py: "python",
    rb: "ruby",
    cs: "csharp",
    yml: "yaml",
  };

  language = languageMap[language] || language;

  // 检查 Prism 是否支持该语言
  if (language && Prism.languages[language]) {
    try {
      const highlighted = Prism.highlight(
        code,
        Prism.languages[language],
        language,
      );
      block.innerHTML = highlighted;
      block.classList.add("language-" + language);
      block.classList.add("prism-highlighted");

      // 同时给父 pre 元素添加语言类
      if (block.parentElement?.tagName === "PRE") {
        block.parentElement.classList.add("language-" + language);
      }
    } catch (e) {
      console.warn("Failed to highlight code:", e);
      block.textContent = code;
    }
  } else {
    // 如果不支持该语言，保持原样但标记为已处理
    block.classList.add("prism-highlighted");
  }
}
