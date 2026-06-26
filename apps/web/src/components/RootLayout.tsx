// apps/web/src/components/RootLayout.tsx

import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TallyFeedbackForm } from "@/components/TallyFeedbackForm";
import { SocialLinks } from "./SocialLinks";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />
      <SocialLinks />

      {/* The <Outlet/> component from react-router-dom will render the active page component here */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <TallyFeedbackForm />
      <Footer />
    </div>
  );
}
