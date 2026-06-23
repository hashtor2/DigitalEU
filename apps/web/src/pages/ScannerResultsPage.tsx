import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function ScannerResultsPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const [scanData, setScanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScanResults = async () => {
      try {
        if (!scanId || !supabase) {
          setError("Invalid scan ID");
          return;
        }

        const { data, error: err } = await supabase
          .from("scanner_scans")
          .select("*")
          .eq("scan_id", scanId)
          .single();

        if (err) {
          setError("Scan not found");
          return;
        }

        setScanData(data);
      } catch (err) {
        console.error("Error fetching scan:", err);
        setError("Failed to load scan results");
      } finally {
        setLoading(false);
      }
    };

    fetchScanResults();
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-text-primary dark:text-dark-text-primary">Loading scan results...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !scanData) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-text-primary dark:text-dark-text-primary text-lg">{error || "Scan not found"}</div>
          <Button onClick={() => window.location.href = "/scanner"}>
            Back to Scanner
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const sovGrade = scanData.sovereignty_grade || "C";

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 sm:px-6 w-full">
        {/* Sovereignty Grade Card */}
        <div className="mb-12 p-8 border border-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-canvas">
          <h1 className="text-h1 font-mono mb-4">Your Digital Sovereignty Grade</h1>
          <div className="flex items-end gap-6">
            <div className="text-6xl font-mono font-bold text-accent">{sovGrade}</div>
            <div className="flex-1">
              <p className="text-text-secondary dark:text-dark-text-secondary mb-2">
                {sovGrade === "A" && "Excellent privacy practices"}
                {sovGrade === "B" && "Good privacy practices"}
                {sovGrade === "C" && "Moderate privacy risks"}
                {sovGrade === "D" && "Significant privacy risks"}
              </p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                Based on {scanData.total_accounts_detected || 0} detected services
              </p>
            </div>
          </div>
        </div>

        {/* Detected Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold mb-6 text-text-primary dark:text-dark-text-primary">
            Detected Services ({scanData.total_accounts_detected || 0})
          </h2>
          <div className="grid gap-3">
            {/* Placeholder for detected services list */}
            <div className="p-4 border border-border dark:border-dark-border rounded text-text-secondary dark:text-dark-text-secondary">
              Services will be displayed here once scan data is available
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={() => window.location.href = "/scanner"}
            className="bg-accent text-white hover:bg-accent-hover rounded-sm"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-border dark:border-dark-border rounded-sm"
          >
            Save as PDF
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}