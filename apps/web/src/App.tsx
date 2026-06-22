import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./pages/SelectorPage")).SelectorPage,
    }),
  },
  {
    path: "/b2c",
    lazy: async () => ({
      Component: (await import("./pages/SelectorPage")).SelectorPage,
    }),
  },
  {
    path: "/start",
    lazy: async () => ({
      Component: (await import("./pages/AudienceSelectorPage")).AudienceSelectorPage,
    }),
  },
  {
    path: "/landing",
    lazy: async () => ({
      Component: (await import("./components/LandingPage")).LandingPage,
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
    path: "/guides/:id",
    lazy: async () => ({
      Component: (await import("./pages/GuidePage")).GuidePage,
    }),
  },
  {
    path: "/about",
    lazy: async () => ({
      Component: (await import("./pages/AboutPage")).AboutPage,
    }),
  },
  {
    path: "/services/:id",
    lazy: async () => ({
      Component: (await import("./pages/ServicePage")).ServicePage,
    }),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
