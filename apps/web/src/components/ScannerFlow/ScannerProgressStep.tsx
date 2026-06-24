/**
 * ScannerProgressStep.tsx — Shows scanning progress with visual feedback
 */

interface ScannerProgressStepProps {
  progress: number; // 0-100
  scannedCount: number; // number of emails scanned
}

export function ScannerProgressStep({
  progress,
  scannedCount,
}: ScannerProgressStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      {/* Spinner/Animation */}
      <div className="flex justify-center py-12">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-border-subtle dark:border-dark-border-subtle"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent border-r-transparent animate-spin"
            style={{
              animationDuration: "1s",
            }}
          ></div>
        </div>
      </div>

      {/* Status text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
          Scanning your inbox...
        </h2>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          {scannedCount > 0
            ? `Analyzed ${scannedCount} emails • Finding services...`
            : "Fetching your email metadata..."}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full bg-canvas-elevated dark:bg-dark-canvas-elevated rounded-full h-2 overflow-hidden border border-border-subtle dark:border-dark-border-subtle">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
          {progress}% complete
        </p>
      </div>

      {/* Info box */}
      <div className="bg-canvas-elevated dark:bg-dark-canvas-elevated rounded-lg p-4 text-left border border-border-subtle dark:border-dark-border-subtle">
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
          ℹ️ We're fetching your email sender list server-side and matching it
          against our catalog of privacy-invasive services. This usually takes
          30–60 seconds.
        </p>
      </div>
    </div>
  );
}
