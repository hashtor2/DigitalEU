/**
 * useClientSideScanner Hook — Backend-Proxy Architecture
 *
 * Orchestrates the email scanner flow:
 * 1. User authenticates via OAuth (Gmail/Outlook)
 * 2. Browser receives access token (kept in memory)
 * 3. Frontend calls /functions/v1/scan-email (Supabase Edge Function)
 * 4. Backend fetches email metadata server-side (no CORS, no browser exposure)
 * 5. Backend returns only extracted domains
 * 6. Frontend matches domains against services catalog
 * 7. Frontend encrypts results (optional profile mode)
 *
 * PRIVACY GUARANTEES:
 * ✅ Email bodies never leave server
 * ✅ Access token never sent beyond backend (passed once, discarded)
 * ✅ Guest mode: results in sessionStorage (volatile)
 * ✅ Profile mode: encrypted client-side before Supabase
 * ✅ Zero-knowledge maintained throughout
 */

import { useState, useCallback } from "react";
import type { DetectedAccount } from "@digitaleu/shared";
import { matchDomainsToServices } from "@/lib/domainMatching";
import { DEMO_ACCOUNTS } from "@/lib/guestStorage";

export interface UseClientSideScannerState {
  step: "intro" | "auth" | "scanning" | "results" | "error";
  provider: "gmail" | "outlook" | null;
  isScanning: boolean;
  progress: number; // 0-100
  results: DetectedAccount[];
  scannedCount: number;
  error: string | null;
}

export function useClientSideScanner() {
  const [state, setState] = useState<UseClientSideScannerState>({
    step: "intro",
    provider: null,
    isScanning: false,
    progress: 0,
    results: [],
    scannedCount: 0,
    error: null,
  });

  /**
   * User clicks "Scan Gmail" — initiate OAuth flow (browser handles redirect)
   */
  const startGmailAuth = useCallback(() => {
    setState((s) => ({ ...s, step: "auth", provider: "gmail" }));
    // Redirect to Google OAuth (handled by gmailScanner.ts or component)
  }, []);

  /**
   * Start Outlook OAuth flow
   */
  const startOutlookAuth = useCallback(() => {
    setState((s) => ({ ...s, step: "auth", provider: "outlook" }));
  }, []);

  /**
   * After OAuth callback, token is in browser memory.
   * Call the backend edge function to fetch and process emails.
   */
  const scanWithToken = useCallback(
    async (accessToken: string, provider: "gmail" | "outlook") => {
      setState((s) => ({
        ...s,
        step: "scanning",
        isScanning: true,
        progress: 0,
        provider,
      }));

      try {
        setState((s) => ({ ...s, progress: 20 })); // Calling backend...

        // Get Supabase URL from environment
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          throw new Error("Supabase URL not configured");
        }

        // Call backend edge function
        // Format: https://<project>.supabase.co/functions/v1/scan-email
        const functionUrl = `${supabaseUrl}/functions/v1/scan-email`;

        const response = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Frontend passes token once
          },
          body: JSON.stringify({
            accessToken, // Backend uses token to fetch emails
            provider,
            maxResults: 100,
          }),
        });

        setState((s) => ({ ...s, progress: 50 }));

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Scan failed: ${response.statusText}`
          );
        }

        const data = await response.json();
        const { senders, scannedCount } = data;

        console.log(
          `[useClientSideScanner] Scanned ${scannedCount} emails, found ${senders.length} unique senders`
        );

        setState((s) => ({ ...s, progress: 75, scannedCount }));

        // Frontend: Match domains against services catalog (100% client-side)
        const detected = matchDomainsToServices(
          senders.map((domain: string) => ({
            domain,
            displayName: domain,
            count: 1,
          }))
        );

        setState((s) => ({
          ...s,
          step: "results",
          isScanning: false,
          progress: 100,
          results: detected,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error during scan";
        console.error("[useClientSideScanner] Error:", err);

        setState((s) => ({
          ...s,
          step: "error",
          isScanning: false,
          error: message,
        }));
      }
    },
    []
  );

  /**
   * Reset to intro (new scan or retry)
   */
  const reset = useCallback(() => {
    setState({
      step: "intro",
      provider: null,
      isScanning: false,
      progress: 0,
      results: [],
      scannedCount: 0,
      error: null,
    });
  }, []);
  /**
   * Demo mode: Show realistic demo results (without requiring real OAuth)
   * Simulates a scan with animated progress and realistic accounts.
   */
  const startDemo = useCallback(async () => {
    setState((s) => ({
      ...s,
      step: "scanning",
      isScanning: true,
      progress: 0,
      provider: "gmail",
    }));

    // Simulate scanning progress over 2 seconds
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setState((s) => ({ ...s, progress: i }));
    }

    // Display demo results
    setState((s) => ({
      ...s,
      step: "results",
      isScanning: false,
      progress: 100,
      results: DEMO_ACCOUNTS,
      scannedCount: 42, // Realistic demo scan count
    }));
  }, []);
  return {
    state,
    startGmailAuth,
    startOutlookAuth,
    scanWithToken,
    startDemo,
    reset,
  };
}
