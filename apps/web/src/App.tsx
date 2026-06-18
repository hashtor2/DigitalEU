import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    // Lazy-lastet: holder Supabase ute av landingssidens bundle.
    path: "/dashboard",
    lazy: async () => ({
      Component: (await import("./pages/DashboardPage")).DashboardPage,
    }),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
