import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <TocProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/tag/:tagName" element={<Tag />} />
            <Route path="/group/:groupName" element={<Group />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:slug" element={<Page />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </TocProvider>
    </BrowserRouter>
  );
}

export default App;
