import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { RootLayout } from "./components/RootLayout";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
        path: "/privacy",
        lazy: async () => ({
          Component: (await import("./pages/PrivacyPolicyPage")).PrivacyPolicyPage,
        }),
      },
      {
        path: "/terms",
        lazy: async () => ({
          Component: (await import("./pages/TermsPage")).TermsPage,
        }),
      },
      {
        path: "/qa/analytics",
        lazy: async () => ({
          Component: (await import("./pages/AnalyticsQAPage")).AnalyticsQAPage,
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
        path: "/scanner/*",
        lazy: async () => ({
          Component: (await import("./pages/ScannerPage")).ScannerPage,
        }),
      },
      {
        path: "/verify",
        lazy: async () => ({
          Component: (await import("./pages/VerifyEmailPage")).VerifyEmailPage,
        }),
      },
    ],
  }
]);

export default function App() {
  // Initialize theme on mount
  useTheme();

  useEffect(() => {
    const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (!import.meta.env.PROD || !plausibleDomain) {
      return;
    }

    if (document.querySelector('script[data-plausible="true"]')) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.dataset.plausible = "true";
    script.src = import.meta.env.VITE_PLAUSIBLE_SCRIPT_SRC || "https://plausible.io/js/script.js";
    document.head.appendChild(script);

    if (!(window as any).plausible) {
      (window as any).plausible = (...args: unknown[]) => {
        ((window as any).plausible.q = (window as any).plausible.q || []).push(args);
      };
    }
  }, []);

  const routerContent = <RouterProvider router={router} />

  return stripePromise ? (
    <Elements stripe={stripePromise}>
      {routerContent}
    </Elements>
  ) : (
      <RouterProvider router={router} />
  )
}
