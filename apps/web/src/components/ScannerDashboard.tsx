import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface ScannerDashboardProps {
  userId: string;
}

export function ScannerDashboard({ userId }: ScannerDashboardProps) {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const { data } = await supabase
          ?.from("scanner_scans")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          ?? { data: [] };

        setScans(data || []);
      } catch (err) {
        console.error("Error fetching scans:", err);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchScans();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center py-12">Loading your scans...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-mono text-text-primary dark:text-dark-text-primary mb-2">
          Your Scans
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          Review your privacy reports and detected services
        </p>
      </div>

      {/* New scan button */}
      <div className="mb-10">
        <Button className="bg-accent text-white hover:bg-accent-hover rounded-sm font-semibold px-6 py-3">
          + New Scan
        </Button>
      </div>

      {/* Scans table */}
      {scans.length === 0 ? (
        <div className="p-8 border border-border dark:border-dark-border rounded-lg text-center">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            No scans yet. Start your first scan to see your digital footprint.
          </p>
          <Button className="bg-accent text-white hover:bg-accent-hover rounded-sm">
            Start First Scan
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-dark-border">
                <th className="text-left p-4 font-semibold text-text-primary dark:text-dark-text-primary">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-text-primary dark:text-dark-text-primary">
                  Services Found
                </th>
                <th className="text-left p-4 font-semibold text-text-primary dark:text-dark-text-primary">
                  Grade
                </th>
                <th className="text-left p-4 font-semibold text-text-primary dark:text-dark-text-primary">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b border-border dark:border-dark-border hover:bg-accent/5">
                  <td className="p-4 text-text-secondary dark:text-dark-text-secondary">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold text-text-primary dark:text-dark-text-primary">
                    {scan.total_accounts_detected} accounts
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-3 py-1 rounded-sm bg-accent/20 text-accent font-mono font-bold">
                      {scan.sovereignty_grade || "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={`/scanner/results/${scan.scan_id}`}
                      className="text-accent hover:underline font-semibold"
                    >
                      View →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}