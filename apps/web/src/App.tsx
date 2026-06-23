import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "./hooks/useTheme";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./components/LandingPage")).LandingPage,
    }),
  },
  {
    path: "/selector",
    lazy: async () => ({
      Component: (await import("./pages/SelectorPage")).SelectorPage,
    }),
  },
  {
    path: "/report",
    lazy: async () => ({
      Component: (await import("./components/ReportPage")).ReportPage,
    }),
  },
  {
    path: "/how",
    lazy: async () => ({
      Component: (await import("./components/HowItWorksPage")).HowItWorksPage,
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
    path: "/emailscanner",
    lazy: async () => ({
      Component: (await import("./pages/EmailScannerPage")).EmailScannerPage,
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
  {
    path: "/alternative/:id",
    lazy: async () => ({
      Component: (await import("./pages/AlternativePage")).AlternativePage,
    }),
  },
  {
    path: "/scanner",
    lazy: async () => ({
      Component: (await import("./pages/ScannerPage")).ScannerPage,
    }),
  },
  {
    path: "/scanner/results/:scanId",
    lazy: async () => ({
      Component: (await import("./pages/ScannerResultsPage")).ScannerResultsPage,
    }),
  },
  {
    path: "/verify",
    lazy: async () => ({
      Component: (await import("./pages/VerifyEmailPage")).VerifyEmailPage,
    }),
  },
]);

export default function App() {
  // Initialize theme on mount
  useTheme();

  return (
    <Elements stripe={stripePromise}>
      <RouterProvider router={router} />
    </Elements>
  );
}
