import NProgress from "nprogress";

export const delayedNavigate = (
  navigate: any,
  path: string,
  e?: React.MouseEvent
) => {
  if (e) {
    e.preventDefault();
  }
  NProgress.start();
  setTimeout(() => {
    navigate(path);
    // NProgress.done is removed from here. It will be called on the new page.
  }, 500); // 500ms delay
};
