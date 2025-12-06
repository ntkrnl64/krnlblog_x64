import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Post from "./pages/Post";
import About from "./pages/About";
import Archive from "./pages/Archive";
import Tag from "./pages/Tag";
import Group from "./pages/Group";
import NotFound from "./pages/NotFound";
import Page from "./pages/Page";
import SearchPage from "./pages/Search";
import { TocProvider } from "./contexts/TocContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "./components/AnimatedPage";
import NProgress from "nprogress";
import { useEffect } from "react";
import DebugLoader from "./components/DebugLoader"; // Import the new debug loader component

function App() {
  const location = useLocation();
  useEffect(() => {
    NProgress.done();
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <TocProvider>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <Home />
                  </AnimatedPage>
                }
              />
              <Route
                path="/post/:slug"
                element={
                  <AnimatedPage>
                    <Post />
                  </AnimatedPage>
                }
              />
              <Route
                path="/about"
                element={
                  <AnimatedPage>
                    <About />
                  </AnimatedPage>
                }
              />
              <Route
                path="/archive"
                element={
                  <AnimatedPage>
                    <Archive />
                  </AnimatedPage>
                }
              />
              <Route
                path="/tag/:tagName"
                element={
                  <AnimatedPage>
                    <Tag />
                  </AnimatedPage>
                }
              />
              <Route
                path="/group/:groupName"
                element={
                  <AnimatedPage>
                    <Group />
                  </AnimatedPage>
                }
              />
              <Route
                path="/search"
                element={
                  <AnimatedPage>
                    <SearchPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/:slug"
                element={
                  <AnimatedPage>
                    <Page />
                  </AnimatedPage>
                }
              />
              {/* New debug route for loader */}
              <Route
                path="/debug/loader"
                element={
                  <AnimatedPage>
                    <DebugLoader />
                  </AnimatedPage>
                }
              />
              <Route
                path="*"
                element={
                  <AnimatedPage>
                    <NotFound />
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </Layout>
      </TocProvider>
    </ThemeProvider>
  );
}

export default App;

