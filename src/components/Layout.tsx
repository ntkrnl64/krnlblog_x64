const globalCodeBlockStyle = `
  pre, code {
    word-break: break-all;
    white-space: pre-wrap;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
  }
  pre {
    overflow-x: auto;
    background: #f5f5f5;
    border-radius: 6px;
    padding: 1em;
    margin: 1em 0;
    max-width: 100vw;
    box-sizing: border-box;
  }
  @media (prefers-color-scheme: dark) {
    pre {
      background: #1e1e1e;
    }
  }
  @media (max-width: 600px) {
    pre, code {
      font-size: 13px;
    }
    pre {
      white-space: pre;
      word-break: break-all;
      overflow-x: auto;
      max-width: 100vw;
    }
  }
`;

import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  tokens,
  TabList,
  Tab,
  makeStyles,
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
} from "@fluentui/react-components";
import { Navigation20Regular, Dismiss24Regular } from "@fluentui/react-icons";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNotice } from "../lib/content";
import RenderedPage from "./RenderedPage";
import { useToc } from "../contexts/TocContext";
import { useTheme } from "../contexts/ThemeContext";
import { delayedNavigate } from "../lib/navigation";

// 判断是否为手机端
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalXL,
    paddingBottom: tokens.spacingVerticalL,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "@media (max-width: 768px)": {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
      paddingTop: tokens.spacingVerticalL,
      paddingBottom: tokens.spacingVerticalM,
    },
  },
  headerTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: tokens.spacingVerticalXS,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    justifyContent: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: tokens.colorBrandForeground1,
    "@media (max-width: 768px)": {
      fontSize: "24px",
    },
  },
  desc: {
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    fontSize: "15px",
  },
  navBelow: {
    display: "flex",
    justifyContent: "center",
    marginTop: tokens.spacingVerticalS,
  },
  desktopNav: {
    display: "flex",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  mobileNav: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "flex",
      justifyContent: "flex-start",
    },
  },
  mobileMenuButton: {
    position: "absolute",
    left: tokens.spacingHorizontalM,
    top: "50%",
    transform: "translateY(-50%)",
  },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    ":hover": {
      textDecoration: "none",
    },
  },
  drawerNav: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalL,
  },
  drawerNavItem: {
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: "none",
    color: tokens.colorNeutralForeground1,
    fontSize: "16px",
    fontWeight: 500,
    transition: "background 0.2s",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  drawerNavItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  mainWrap: {
    display: "flex",
    flex: 1,
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    gap: tokens.spacingHorizontalXL,
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    "@media (max-width: 1200px)": {
      gap: tokens.spacingHorizontalL,
    },
    "@media (max-width: 900px)": {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
    },
    "@media (max-width: 768px)": {
      flexDirection: "column",
      paddingTop: tokens.spacingVerticalL,
      paddingBottom: tokens.spacingVerticalL,
    },
  },
  container: {
    flex: 1,
    minWidth: 0,
  },
  sidebar: {
    width: "280px",
    flexShrink: 0,
    position: "sticky",
    top: tokens.spacingVerticalXL,
    alignSelf: "flex-start",
    maxHeight: `calc(100vh - ${tokens.spacingVerticalXXL} * 2)`,
    overflowY: "auto",
    overflowX: "hidden",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  footer: {
    textAlign: "center",
    paddingTop: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground3,
    fontSize: "14px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  contextBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  contextMenu: {
    position: "fixed",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    padding: tokens.spacingVerticalS,
    zIndex: 1001,
    minWidth: "160px",
  },
});

export function Layout({ children }: PropsWithChildren) {
  const styles = useStyles();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [site, setSite] = useState<{
    title?: string;
    description?: string;
    icon?: string;
    author?: { name?: string; bio?: string; avatar?: string };
    footer?: string;
    aboutMenuHref?: string;
  } | null>(null);
  const [notice, setNotice] = useState<{ html: string; title?: string } | null>(
    null,
  );
  const { toc } = useToc();
  const { isDark, toggleTheme } = useTheme();
  const [ctx, setCtx] = useState<{ open: boolean; x: number; y: number }>({
    open: false,
    x: 0,
    y: 0,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentTab = location.pathname.startsWith("/archive")
    ? "archive"
    : location.pathname.startsWith("/search")
      ? "search"
      : location.pathname.startsWith("/about")
        ? "about"
        : "home";

  // 设置页面标题
  useEffect(() => {
    if (!site?.title) return;
    // 设置 favicon
    if (site.icon) {
      let link = document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = site.icon;
    }
    // 设置标题
    if (location.pathname === "/") {
      document.title = site.title;
    } else if (location.pathname === "/archive") {
      document.title = `归档 - ${site.title}`;
    } else if (location.pathname === "/about") {
      document.title = `关于 - ${site.title}`;
    } else if (location.pathname.startsWith("/tag/")) {
      const tag = decodeURIComponent(location.pathname.replace("/tag/", ""));
      document.title = `标签：${tag} - ${site.title}`;
    } else if (location.pathname.startsWith("/group/")) {
      const group = decodeURIComponent(
        location.pathname.replace("/group/", ""),
      );
      document.title = `分组：${group} - ${site.title}`;
    } else if (location.pathname.startsWith("/search")) {
      document.title = `搜索 - ${site.title}`;
    } else {
      document.title = site.title;
    }
  }, [site, location]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/config.json");
        const data = await response.json();
        setSite(data);
      } catch {
        setSite({ title: "KrnlBlog X64" });
      }
    };

    const loadNotice = () => {
      try {
        const noticePost = getNotice?.();
        if (noticePost) {
          setNotice({ html: noticePost.html, title: noticePost.title });
        } else {
          setNotice({ html: "<p>暂无公告</p>" });
        }
      } catch {
        setNotice({ html: "<p>暂无公告</p>" });
      }
    };

    void loadConfig();
    loadNotice();
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtx({ open: true, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setCtx({ open: false, x: 0, y: 0 });

  return (
    <>
      <style>{globalCodeBlockStyle}</style>
      <FluentProvider
        theme={isDark ? webDarkTheme : webLightTheme}
        className={styles.root}
        onContextMenu={handleContextMenu}
      >
        <header className={styles.header}>
          <div className={styles.headerTop} style={{ position: "relative" }}>
            {isMobile && (
              <Button
                appearance="subtle"
                icon={<Navigation20Regular />}
                onClick={() => setIsDrawerOpen(true)}
                className={styles.mobileMenuButton}
                aria-label="打开菜单"
              />
            )}
            <div className={styles.titleRow} style={{ width: "100%" }}>
              <div className={styles.title}>
                {site?.title ?? "KrnlBlog X64"}
              </div>
            </div>
            {site?.description && (
              <div className={styles.desc}>{site.description}</div>
            )}
          </div>
          <div className={styles.navBelow}>
            <div className={styles.desktopNav}>
              <TabList selectedValue={currentTab}>
                <Tab value="home">
                  <a
                    className={styles.navLink}
                    href="/"
                    onClick={(e) => delayedNavigate(navigate, "/", e)}
                  >
                    首页
                  </a>
                </Tab>
                <Tab value="archive">
                  <a
                    className={styles.navLink}
                    href="/archive"
                    onClick={(e) => delayedNavigate(navigate, "/archive", e)}
                  >
                    归档
                  </a>
                </Tab>
                <Tab value="search">
                  <a
                    className={styles.navLink}
                    href="/search"
                    onClick={(e) => delayedNavigate(navigate, "/search", e)}
                  >
                    搜索
                  </a>
                </Tab>
                <Tab value="about">
                  <a
                    className={styles.navLink}
                    href={site?.aboutMenuHref || "/about"}
                    onClick={(e) =>
                      delayedNavigate(navigate, site?.aboutMenuHref || "/about", e)
                    }
                  >
                    关于
                  </a>
                </Tab>
              </TabList>
            </div>
          </div>
        </header>

        <main className={styles.mainWrap}>
          <div className={styles.container}>{children}</div>
          {!isMobile && (
            <aside className={styles.sidebar}>
              {/* 目录 */}
              {toc.length > 0 && (
                <section
                  style={{
                    marginBottom: 32,
                    paddingBottom: 20,
                    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 12,
                      color: tokens.colorBrandForeground1,
                    }}
                  >
                    📑 目录
                  </div>
                  <nav>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {toc.map((item) => (
                        <li
                          key={item.id}
                          style={{
                            marginLeft: (item.level - 2) * 12,
                            marginTop: 6,
                          }}
                        >
                          <a
                            href={`#${item.id}`}
                            style={{
                              color: tokens.colorNeutralForeground2,
                              textDecoration: "none",
                              fontSize: 14,
                              display: "block",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color =
                                tokens.colorBrandForeground1)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color =
                                tokens.colorNeutralForeground2)
                            }
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </section>
              )}

              {/* 作者信息块 */}
              {site?.author && (
                <section
                  style={{
                    marginBottom: 32,
                    paddingBottom: 20,
                    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <img
                      src={site.author.avatar || site.icon || "/vite.svg"}
                      alt="avatar"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{site.author.name}</div>
                      <div
                        style={{
                          fontSize: 13,
                          color: tokens.colorNeutralForeground3,
                        }}
                      >
                        {site.author.bio}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* 公告块 */}
              <section style={{ marginBottom: 32, paddingBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  📢 公告
                </div>
                <div style={{ fontSize: 14 }}>
                  <RenderedPage html={notice?.html || ""} />
                </div>
              </section>
            </aside>
          )}
        </main>

        {isMobile && (
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              width: "100%",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                background: tokens.colorNeutralBackground2,
                borderRadius: 12,
                boxShadow: tokens.shadow8,
                padding: 20,
                margin: "0 16px",
              }}
            >
              {site?.author && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                    paddingBottom: 12,
                  }}
                >
                  <img
                    src={site.author.avatar || site.icon || "/vite.svg"}
                    alt="avatar"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{site.author.name}</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: tokens.colorNeutralForeground3,
                      }}
                    >
                      {site.author.bio}
                    </div>
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  📢 公告
                </div>
                <div style={{ fontSize: 14 }}>
                  <RenderedPage html={notice?.html || ""} />
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          <span
            dangerouslySetInnerHTML={{
              __html: site?.footer || "Powered by React + Fluent UI + Vite",
            }}
          />
        </footer>

        {/* 手机端抽屉菜单 */}
        <Drawer
          type="overlay"
          position="start"
          open={isDrawerOpen}
          onOpenChange={(_, { open }) => setIsDrawerOpen(open)}
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="关闭"
                  icon={<Dismiss24Regular />}
                  onClick={() => setIsDrawerOpen(false)}
                />
              }
            >
              菜单
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody>
            <nav className={styles.drawerNav}>
              <a
                href="/"
                className={`${styles.drawerNavItem} ${
                  currentTab === "home" ? styles.drawerNavItemActive : ""
                }`}
                onClick={(e) => {
                  delayedNavigate(navigate, "/", e);
                  setIsDrawerOpen(false);
                }}
              >
                🏠 首页
              </a>
              <a
                href="/archive"
                className={`${styles.drawerNavItem} ${
                  currentTab === "archive" ? styles.drawerNavItemActive : ""
                }`}
                onClick={(e) => {
                  delayedNavigate(navigate, "/archive", e);
                  setIsDrawerOpen(false);
                }}
              >
                📚 归档
              </a>
              <a
                href="/search"
                className={`${styles.drawerNavItem} ${
                  currentTab === "search" ? styles.drawerNavItemActive : ""
                }`}
                onClick={(e) => {
                  delayedNavigate(navigate, "/search", e);
                  setIsDrawerOpen(false);
                }}
              >
                🔍 搜索
              </a>
              <a
                href={site?.aboutMenuHref || "/about"}
                className={`${styles.drawerNavItem} ${
                  currentTab === "about" ? styles.drawerNavItemActive : ""
                }`}
                onClick={(e) => {
                  delayedNavigate(navigate, site?.aboutMenuHref || "/about", e);
                  setIsDrawerOpen(false);
                }}
              >
                ℹ️ 关于
              </a>
              <div
                style={{
                  borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
                  marginTop: tokens.spacingVerticalM,
                  paddingTop: tokens.spacingVerticalM,
                }}
              >
                <Button
                  appearance="subtle"
                  onClick={() => {
                    toggleTheme();
                    setIsDrawerOpen(false);
                  }}
                  style={{ width: "100%", justifyContent: "flex-start" }}
                >
                  {isDark ? "🌞 切换亮色模式" : "🌙 切换深色模式"}
                </Button>
              </div>
            </nav>
          </DrawerBody>
        </Drawer>

        {ctx.open && (
          <>
            <div
              className={styles.contextBackdrop}
              onClick={closeContextMenu}
            />
            <div
              className={styles.contextMenu}
              style={{ left: ctx.x, top: ctx.y }}
              onClick={closeContextMenu}
            >
              <Button appearance="subtle" onClick={() => toggleTheme()}>
                切换深浅色
              </Button>
            </div>
          </>
        )}
      </FluentProvider>
    </>
  );
}