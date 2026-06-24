/**
 * ScannerResultsStep.tsx — Shows scan results and next steps
 */

import type { DetectedAccount, Alternative } from "@digitaleu/shared";
import { ALTERNATIVES } from "@digitaleu/shared";
import { ServiceBadge } from "@/components/ServiceBadge";

interface ScannerResultsStepProps {
  results: DetectedAccount[];
  isDemo: boolean;
  onReset: () => void;
  onSaveProfile?: () => void;
}

export function ScannerResultsStep({
  results,
  isDemo,
  onReset,
  onSaveProfile,
}: ScannerResultsStepProps) {
  // Group by category
  const resultsByCategory = results.reduce(
    (acc, result) => {
      const alt = result.suggestedAlternativeId
        ? ALTERNATIVES.find((a) => a.id === result.suggestedAlternativeId)
        : undefined;

      const category = alt?.category || "uncategorized";

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ result, alternative: alt });
      return acc;
    },
    {} as Record<string, Array<{ result: DetectedAccount; alternative?: Alternative }>>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">
          {results.length > 0 ? "We found what you use" : "No services detected"}
        </h2>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          {isDemo ? (
            <>
              This is a demo. <button onClick={onReset} className="underline text-accent">
                Scan your real inbox
              </button>{" "}
              to see your actual services.
            </>
          ) : (
            <>
              Here are the privacy-invasive services we detected in your inbox.
              Switch to the European alternatives below.
            </>
          )}
        </p>
      </div>

      {/* Results by category */}
      {results.length > 0 && (
        <div className="space-y-8">
          {Object.entries(resultsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary capitalize">
                {category.replace("-", " ")}
              </h3>
              <div className="space-y-2">
                {items.map(({ result, alternative }) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-canvas-elevated dark:bg-dark-canvas-elevated border border-border-subtle dark:border-dark-border-subtle hover:border-accent/30 dark:hover:border-accent/30 transition"
                  >
                    {/* Detected service */}
                    <div className="flex-1">
                      <p className="font-medium text-text-primary dark:text-dark-text-primary">
                        {result.serviceName}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                        Detected from: <span className="font-mono">{result.domain}</span>
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="text-text-secondary dark:text-dark-text-secondary">
                      →
                    </div>

                    {/* EU Alternative */}
                    {alternative ? (
                      <div className="flex-1 flex items-center gap-2">
                        <ServiceBadge name={alternative.name} country={alternative.country} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary dark:text-dark-text-primary truncate">
                            {alternative.name}
                          </p>
                          <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                            {alternative.country ? (
                              <>
                                🇪🇺 {alternative.country}
                              </>
                            ) : null}
                          </p>
                        </div>
                        <a
                          href={`/directory/${alternative.id}`}
                          className="px-3 py-1 text-xs bg-accent/10 hover:bg-accent/20 text-accent rounded transition whitespace-nowrap"
                        >
                          Learn more →
                        </a>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary italic">
                          No EU alternative yet
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            Try the demo to see how the scanner works.
          </p>
        </div>
      )}

      {/* CTA Footer */}
      <div className="border-t border-border-subtle dark:border-dark-border-subtle pt-6 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 text-text-primary dark:text-dark-text-primary bg-canvas-elevated dark:bg-dark-canvas-elevated hover:bg-canvas-elevated/90 dark:hover:bg-dark-canvas-elevated/90 border border-border-subtle dark:border-dark-border-subtle rounded-lg transition"
          >
            Start over
          </button>
          {onSaveProfile && !isDemo && (
            <button
              onClick={onSaveProfile}
              className="flex-1 px-4 py-2 text-canvas dark:text-dark-canvas bg-accent hover:bg-accent/90 rounded-lg transition font-medium"
            >
              Save to my account
            </button>
          )}
        </div>
        {!isDemo && (
          <a
            href="/directory"
            className="block w-full text-center px-4 py-2 text-accent hover:underline"
          >
            Browse all European alternatives →
          </a>
        )}
      </div>
    </div>
  );
}
