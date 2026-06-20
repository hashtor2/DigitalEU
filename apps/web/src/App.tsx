import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./components/LandingPage")).LandingPage,
    }),
  },
  {
    path: "/start",
    lazy: async () => ({
      Component: (await import("./pages/AudienceSelectorPage")).AudienceSelectorPage,
    }),
  },
  {
    path: "/b2c",
    lazy: async () => ({
      Component: (await import("./pages/SelectorPage")).SelectorPage,
    }),
  },
  {
    path: "/b2b",
    lazy: async () => ({
      Component: (await import("./pages/B2BPage")).B2BPage,
    }),
  },
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
  {
    path: "/directory/:id",
    lazy: async () => ({
      Component: (await import("./pages/ServicePage")).ServicePage,
    }),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
