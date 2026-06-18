import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/dashboard",
    lazy: async () => ({
      Component: (await import("./pages/DashboardPage")).DashboardPage,
    }),
  },
  {
    path: "/directory",
    lazy: async () => ({
      Component: (await import("./pages/DirectoryPage")).DirectoryPage,
    }),
  },
  {
    path: "/news",
    lazy: async () => ({
      Component: (await import("./pages/NewsPage")).NewsPage,
    }),
  },
  {
    path: "/guides",
    lazy: async () => ({
      Component: (await import("./pages/GuidesPage")).GuidesPage,
    }),
  },
  {
    path: "/about",
    lazy: async () => ({
      Component: (await import("./pages/AboutPage")).AboutPage,
    }),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
