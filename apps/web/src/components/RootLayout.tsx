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

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <TallyFeedbackForm />
      <Footer />
    </div>
  );
}
