import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { RootLayout } from "./components/RootLayout";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: PageLoader,
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
        path: "/verify",
        lazy: async () => ({
          Component: (await import("./pages/VerifyEmailPage")).VerifyEmailPage,
        }),
      },
    ],
  },
  {
    path: "/scanner",
    lazy: async () => ({
      Component: (await import("./pages/scanner/__root")).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/scanner/index")).default,
        }),
      },
      {
        path: "scan",
        lazy: async () => ({
          Component: (await import("./pages/scanner/scan")).default,
        }),
      },
      {
        path: "auth/signin",
        lazy: async () => ({
          Component: (await import("./pages/scanner/auth/signin")).default,
        }),
      },
      {
        path: "auth/signup",
        lazy: async () => ({
          Component: (await import("./pages/scanner/auth/signup")).default,
        }),
      },
      {
        path: "auth/callback",
        lazy: async () => ({
          Component: (await import("./pages/scanner/auth/callback")).default,
        }),
      },
      {
        path: "auth/email-callback",
        lazy: async () => ({
          Component: (await import("./pages/scanner/auth/email-callback")).default,
        }),
      },
      {
        path: "dashboard",
        lazy: async () => ({
          Component: (await import("./pages/scanner/dashboard")).default,
        }),
      },
      {
        path: "results/guest",
        lazy: async () => ({
          Component: (await import("./pages/scanner/results/guest")).default,
        }),
      },
      {
        path: "results/:scanId",
        lazy: async () => ({
          Component: (await import("./pages/scanner/results/$scanId")).default,
        }),
      },
      {
        path: "report/:sessionId",
        lazy: async () => ({
          Component: (await import("./pages/scanner/report/$sessionId")).default,
        }),
      },
      {
        path: "cancel",
        lazy: async () => ({
          Component: (await import("./pages/scanner/cancel/index")).default,
        }),
      },
      {
        path: "cancel/:id",
        lazy: async () => ({
          Component: (await import("./pages/scanner/cancel/$id")).default,
        }),
      },
      {
        path: "toolkit",
        lazy: async () => ({
          Component: (await import("./pages/scanner/toolkit")).default,
        }),
      },
    ],
  },
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
    routerContent
  )
}
