import { Button } from "@/components/ui/button";

export function TallyFeedbackForm() {
  const openTally = () => {
    if ((window as any).Tally) {
      (window as any).Tally.openPopup("J9GB74", {
        emoji: { text: "👋", animation: "wave" },
      });
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 bg-canvas dark:bg-dark-canvas">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary mb-3">
            Help Shape digitaleu.me
          </h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
            We're building this for people like you. Share your feedback and stay in the loop about new features — plus get notified when we launch.
          </p>
          <Button
            onClick={openTally}
            className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Sign up & Share Feedback →
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TallyFeedbackForm;
