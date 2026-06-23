import { useEffect, useState } from "react";

interface ScanProgressProps {
  isScanning: boolean;
  mode: "demo" | "real";
  onComplete: () => void;
}

const STEPS_REAL = [
  "Opening a read-only window into your Gmail…",
  "Sampling sender metadata only (no bodies)…",
  "Finding sign-up, billing and security emails…",
  "Grouping likely accounts by company domain…",
  "Matching known services to European alternatives…",
];

const STEPS_DEMO = [
  "Pretending to open your inbox…",
  "Looking up mock service sign-ups…",
  "Matching against European alternatives…",
  "Tidying the results…",
];

export function ScanProgress({ isScanning, mode, onComplete }: ScanProgressProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const STEPS = mode === "real" ? STEPS_REAL : STEPS_DEMO;

  useEffect(() => {
    if (!isScanning) return;

    const stepInterval = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 700);

    const progressInterval = setInterval(() => {
      setProgress((v) => Math.min(95, v + 3));
    }, 120);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isScanning, STEPS.length]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Spinning indicator */}
      <div className="flex justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 border-4 border-border dark:border-dark-border rounded-sm" />
          <div
            className="absolute inset-0 border-4 border-transparent border-t-accent rounded-sm animate-spin"
            style={{ animationDuration: "1s" }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-h2 font-mono mb-2">
          {mode === "real" ? "Scanning your Gmail" : "Scanning your (demo) inbox"}
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary min-h-6 transition-opacity">
          {STEPS[step]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-border dark:bg-dark-border rounded-sm overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Privacy note */}
      <p className="text-small text-text-secondary dark:text-dark-text-secondary text-center">
        {mode === "real"
          ? "Only sender and subject metadata is read. No email bodies, no storage."
          : "Reminder: no real email is being read. This is a demo of the flow."}
      </p>
    </div>
  );
}
