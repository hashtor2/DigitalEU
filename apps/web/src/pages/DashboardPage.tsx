import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ALTERNATIVES, type MigrationStatus, type DetectedAccount } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";
import { useMigrationState } from "@/hooks/useMigrationState";
import {
  getGoogleAuthUrl,
  extractAccessTokenFromUrl,
  scanGmailInbox,
  isGoogleConfigured,
} from "@/lib/gmailScanner";
import {
  getMicrosoftAuthUrl,
  extractOutlookAccessTokenFromUrl,
  scanOutlookInbox,
  isMicrosoftConfigured,
} from "@/lib/outlookScanner";

const STATUS_LABEL: Record<MigrationStatus, string> = {
  detected: "Detected",
  "in-progress": "In Progress",
  switched: "Switched",
  skipped: "Skipped",
};

const STATUS_STYLE: Record<MigrationStatus, string> = {
  detected: "bg-sky-500/15 text-sky-300",
  "in-progress": "bg-amber-500/15 text-amber-300",
  switched: "bg-emerald-500/15 text-emerald-300",
  skipped: "bg-slate-500/15 text-slate-400",
};

function alternativeName(id?: string): string | undefined {
  return ALTERNATIVES.find((a) => a.id === id)?.name;
}

interface MigrationGuideStep {
  step: number;
  title: string;
  description: string;
}

const MIGRATION_GUIDES: Record<string, { title: string; steps: MigrationGuideStep[] }> = {
  "proton-drive": {
    title: "How to migrate your files to Proton Drive 🇨🇭",
    steps: [
      {
        step: 1,
        title: "Download Your Archive",
        description: "Go to Google Takeout (takeout.google.com) or Dropbox, select only your files/folders, and request a download as a .zip file. Google/Dropbox will email you when your archive is ready.",
      },
      {
        step: 2,
        title: "Create Secure Swiss Storage",
        description: "Sign up or log into Proton Drive (drive.proton.me). Your free or paid tier is fully protected by Swiss privacy laws.",
      },
      {
        step: 3,
        title: "Drag & Drop",
        description: "Extract your downloaded .zip and drag-and-drop your folders directly into the Proton Drive web browser. Encryption is done client-side instantly.",
      },
    ],
  },
  "proton-mail": {
    title: "How to migrate your emails to Proton Mail 🇨🇭",
    steps: [
      {
        step: 1,
        title: "Create Your Secure Address",
        description: "Sign up at proton.me/mail. This will be your new private digital identity.",
      },
      {
        step: 2,
        title: "Run 'Easy Switch' Import",
        description: "Inside Proton Mail, navigate to Settings → Easy Switch. Connect your old Gmail/Outlook. Proton will securely copy all your old emails, folders, and contacts securely and encrypt them.",
      },
      {
        step: 3,
        title: "Turn on Auto-Forwarding",
        description: "Set up auto-forwarding from your old Gmail/Outlook to your new Proton address. This ensures you receive messages while you are updating your external accounts.",
      },
    ],
  },
  "tuta": {
    title: "How to migrate your emails to Tuta Mail 🇩🇪",
    steps: [
      {
        step: 1,
        title: "Sign up for Tuta",
        description: "Create your green, German-engineered encrypted inbox at tuta.com.",
      },
      {
        step: 2,
        title: "Import Your Data",
        description: "Use Tuta's built-in migration tools under Settings to pull contacts and calendar appointments.",
      },
      {
        step: 3,
        title: "Forward Incoming Mail",
        description: "Enable forwarding in your old mailbox settings so any leftover mail is redirected to Tuta while you migrate.",
      },
    ],
  },
  "proton-pass": {
    title: "How to migrate your passwords to Proton Pass 🇨🇭",
    steps: [
      {
        step: 1,
        title: "Export Your Vault",
        description: "Log into your old password manager (LastPass, Chrome, or 1Password). Go to Settings/Advanced and Export your credentials as a .csv file.",
      },
      {
        step: 2,
        title: "Securely Import to Proton",
        description: "Open your new Proton Pass account (pass.proton.me). Go to Settings → Import, select your old provider, and upload your CSV. Credentials are encrypted in your browser.",
      },
      {
        step: 3,
        title: "Uninstall & Wipe",
        description: "Once verified, delete the CSV file from your computer and uninstall your old password manager extension to avoid credential conflicts.",
      },
    ],
  },
};

function MigrationItemRow({
  acc,
  setStatus,
}: {
  acc: DetectedAccount;
  setStatus: (id: string, status: MigrationStatus) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const altName = alternativeName(acc.suggestedAlternativeId);
  const guide = acc.suggestedAlternativeId ? MIGRATION_GUIDES_MAP[acc.suggestedAlternativeId] : null;

  return (
    <li
      className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/15 transition overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{acc.serviceName}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${STATUS_STYLE[acc.status]}`}>
              {STATUS_LABEL[acc.status]}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {acc.domain}
            {altName && (
              <>
                {" → "}
                <span className="text-sky-400 font-bold">{altName} 🇨🇭</span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {guide && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold px-2 py-1"
            >
              {isExpanded ? "Close Guide" : "How to Migrate 📖"}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={acc.status === "switched"}
            onClick={() => setStatus(acc.id, "in-progress")}
            className="text-xs font-semibold px-3 py-1.5"
          >
            In Progress
          </Button>
          <Button
            size="sm"
            disabled={acc.status === "switched"}
            className="bg-emerald-600 text-white hover:bg-emerald-500 transition text-xs font-bold px-3 py-1.5"
            onClick={() => setStatus(acc.id, "switched")}
          >
            Switched ✓
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-500 hover:text-slate-300 text-xs px-2"
            onClick={() => setStatus(acc.id, "skipped")}
          >
            Skip
          </Button>
        </div>
      </div>

      {isExpanded && guide && (
        <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
          <h4 className="text-sm font-bold text-sky-300">{guide.title}</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {guide.steps.map((s) => (
              <div key={s.step} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
                <span className="text-[10px] font-extrabold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
                  Step {s.step}
                </span>
                <h5 className="text-xs font-bold text-white pt-1">{s.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 leading-normal italic pt-1">
            💡 **Tip:** Our Chrome/Firefox companion extension automatically detects this settings page and fills your secure details in one click!
          </p>
        </div>
      )}
    </li>
  );
}

const MIGRATION_GUIDES_MAP: Record<string, { title: string; steps: MigrationGuideStep[] }> = MIGRATION_GUIDES;

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export function DashboardPage() {
  const {
    mode,
    setMode,
    state,
    setStatus,
    mergeDetectedAccounts,
    reset,
    user,
    passphrase,
    loading,
    error,
    setError,
    registerProfile,
    loginProfile,
    loginWithGitHub,
    logoutProfile,
    unlockProfile,
    isConfigured,
  } = useMigrationState();

  const [authTab, setAuthTab] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localPassphrase, setLocalPassphrase] = useState("");

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState("");

  // Target secure email state (stores locally & broad-casts to browser extension)
  const [targetEmail, setTargetEmail] = useState(() => {
    return localStorage.getItem("digitaleu_target_email") || "";
  });

  // Coze AI Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "Hello! I am your DigitalEU Sovereign AI Assistant (powered by Coze 🤖). Ask me anything about leaving Big Tech, data security, or setting up Swiss-based encryptions!" }
  ]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Detect OAuth redirect hashes on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    const scope = params.get("scope") || "";

    if (token) {
      if (scope.includes("googleapis.com") || scope.includes("gmail")) {
        // Clear hash and run Gmail scan
        extractAccessTokenFromUrl();
        handleRealGmailScan(token);
      } else {
        // Clear hash and run Outlook scan
        extractOutlookAccessTokenFromUrl();
        handleRealOutlookScan(token);
      }
    }
  }, []);

  // Scroll AI Chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiTyping]);

  // Sync changes to target secure email
  function handleTargetEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTargetEmail(val);
    localStorage.setItem("digitaleu_target_email", val);
    
    // Broadcast to extension content script immediately
    window.postMessage({ type: "DIGITALEU_SET_TARGET", targetEmail: val }, "*");
  }

  function syncTargetWithExtension() {
    window.postMessage({ type: "DIGITALEU_SET_TARGET", targetEmail }, "*");
    alert("Extension linked successfully! Go to any change-email settings page to test the automatic 1-click autofill.");
  }

  // Listen for automated completion messages from our extension content script
  useEffect(() => {
    function handleExtensionMessage(event: MessageEvent) {
      // Security: Only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "DIGITALEU_AUTOFILL_COMPLETED" && event.data?.domain) {
        const domain = event.data.domain;
        
        // Find matching checklist item
        const matchedAccount = state.accounts.find(
          (a) => a.domain === domain || domain.endsWith(a.domain)
        );

        if (matchedAccount) {
          setStatus(matchedAccount.id, "switched");
          console.log(`[Dashboard] Automatically checked off ${matchedAccount.serviceName} based on extension autofill!`);
        }
      }
    }

    window.addEventListener("message", handleExtensionMessage);
    return () => window.removeEventListener("message", handleExtensionMessage);
  }, [state.accounts, setStatus]);

  async function handleRealGmailScan(token: string) {
    setIsScanning(true);
    setScanProgress(10);
    setScanStepText("Connecting to Gmail securely...");
    setError(null);
    try {
      const scanned = await scanGmailInbox(token, (percent, step) => {
        setScanProgress(percent);
        setScanStepText(step);
      });
      mergeDetectedAccounts(scanned);
    } catch (err: any) {
      console.error(err);
      setError("Gmail scanning failed. Please verify your connection or try again.");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleRealOutlookScan(token: string) {
    setIsScanning(true);
    setScanProgress(10);
    setScanStepText("Connecting to Microsoft Outlook securely...");
    setError(null);
    try {
      const scanned = await scanOutlookInbox(token, (percent, step) => {
        setScanProgress(percent);
        setScanStepText(step);
      });
      mergeDetectedAccounts(scanned);
    } catch (err: any) {
      console.error(err);
      setError("Outlook scanning failed. Please verify your connection or try again.");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleDemoScan() {
    setIsScanning(true);
    setError(null);
    const demoSteps = [
      { percent: 15, text: "🔒 Initializing secure local sandbox..." },
      { percent: 45, text: "🔍 Scanning browser-simulated email headers..." },
      { percent: 75, text: "📂 Cross-referencing domains with service registries..." },
      { percent: 90, text: "🛡️ Checking breach databases (Have I Been Pwned)..." },
      { percent: 100, text: "✓ Done! Creating secure local migration vault..." }
    ];

    for (const step of demoSteps) {
      setScanProgress(step.percent);
      setScanStepText(step.text);
      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 300));
    }

    const mockScanned: DetectedAccount[] = [
      { id: "gmail", domain: "gmail.com", serviceName: "Gmail", status: "detected", suggestedAlternativeId: "proton-mail" },
      { id: "netflix", domain: "netflix.com", serviceName: "Netflix", status: "detected" },
      { id: "spotify", domain: "spotify.com", serviceName: "Spotify", status: "detected" },
      { id: "dropbox", domain: "dropbox.com", serviceName: "Dropbox", status: "detected", suggestedAlternativeId: "proton-drive" },
      { id: "lastpass", domain: "lastpass.com", serviceName: "LastPass", status: "detected", suggestedAlternativeId: "proton-pass" },
    ];

    mergeDetectedAccounts(mockScanned);
    setIsScanning(false);
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !localPassphrase) {
      setError("All fields must be filled out.");
      return;
    }
    try {
      if (authTab === "register") {
        await registerProfile(email, password, localPassphrase);
      } else {
        await loginProfile(email, password, localPassphrase);
      }
      setEmail("");
      setPassword("");
      setLocalPassphrase("");
    } catch (err) {
      // Error is set inside useMigrationState
    }
  }

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localPassphrase) {
      setError("Please provide your privacy passphrase.");
      return;
    }
    unlockProfile(localPassphrase);
    setLocalPassphrase("");
  }

  // Handle Preset AI Chat Questions
  async function triggerAiResponse(questionText: string) {
    if (isAiTyping) return;
    setChatMessages((prev) => [...prev, { sender: "user", text: questionText }]);
    setIsAiTyping(true);

    // Simulate Dify/Coze agent stream response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let reply = "I am ready to help! Let me look into your digital migration checklist...";
    if (questionText.toLowerCase().includes("photos")) {
      reply = "📸 To move your photos securely away from Google/Apple, we recommend Ente Photos 🇫🇷. It is French-hosted, open-source, and fully end-to-end encrypted. 1. Request an archive from Google Takeout (Photos only). 2. Create an Ente account. 3. Import the zip archive using Ente's web or desktop apps. Your memories are now 100% private!";
    } else if (questionText.toLowerCase().includes("why proton")) {
      reply = "✉️ Google's business model is advertising; they scan your mail metadata, attachments, search footprints, and locations to target marketing profiles. Proton Mail 🇨🇭 operates on zero-access encryption under Swiss jurisdiction. They physically cannot read your mail, and are funded entirely by secure premium subscriptions rather than selling your identity.";
    } else if (questionText.toLowerCase().includes("safe")) {
      reply = "🔒 Yes, 100%! DigitalEU's email scanner operates entirely inside your local browser tab (sandbox). Your emails, access tokens, and data never touch any server. Your tokens are completely cleared out of the address bar and memory as soon as you close the tab.";
    }

    setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    setIsAiTyping(false);
  }

  function handleCustomChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    const q = customQuestion;
    setCustomQuestion("");
    triggerAiResponse(q);
  }

  const switched = state.accounts.filter((a) => a.status === "switched").length;
  const total = state.accounts.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">
            ← digitaleu.me
          </Link>

          <div className="flex items-center gap-4">
            {user && mode === "profile" && (
              <span className="hidden sm:inline text-xs text-slate-500">
                Profile: <span className="text-slate-300 font-mono">{user.email}</span>
              </span>
            )}
            <div className="flex gap-1 rounded-lg border border-white/10 p-1 bg-slate-900">
              <button
                onClick={() => setMode("guest")}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                  mode === "guest"
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Guest
              </button>
              <button
                onClick={() => setMode("profile")}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                  mode === "profile"
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Migration Dashboard</h1>

        {/* ERROR MESSAGES */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 text-xs font-semibold px-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. GUEST MODE NOTICE */}
        {mode === "guest" && (
          <div className="mt-4 rounded-xl border border-sky-400/10 bg-sky-400/5 p-5">
            <p className="font-semibold text-sky-200 flex items-center gap-2">
              🔒 Guest Mode Active
            </p>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">
              Your data is stored 100% locally in this browser tab (`sessionStorage`).
              No data ever leaves your device or is sent to the cloud. If you close this tab, your progress will be wiped.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMode("profile")}
                className="border-sky-500/30 text-sky-300 hover:bg-sky-500/10"
              >
                Sync cryptographically to cloud (Profile Mode)
              </Button>
            </div>
          </div>
        )}

        {/* 2. PROFILE MODE: NOT CONFIGURATED */}
        {mode === "profile" && !isConfigured && (
          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="font-semibold text-amber-200">Profile Mode Not Configured</p>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              Profile Mode requires a Supabase database link in your `.env` file.
              Please check `.env.example` to set up your private hosting.
            </p>
          </div>
        )}

        {/* 3. PROFILE MODE: LOGIN / REGISTER */}
        {mode === "profile" && isConfigured && !user && (
          <div className="mt-6 max-w-md mx-auto rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex justify-center border-b border-white/5 pb-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab("register");
                  setError(null);
                }}
                className={`flex-1 text-center pb-2 text-sm font-semibold transition ${
                  authTab === "register"
                    ? "border-b-2 border-sky-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab("login");
                  setError(null);
                }}
                className={`flex-1 text-center pb-2 text-sm font-semibold transition ${
                  authTab === "login"
                    ? "border-b-2 border-sky-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Log In
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Password (Account login)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  placeholder="At least 6 characters..."
                />
              </div>

              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
                    🔑 Privacy Passphrase
                  </label>
                  <input
                    type="password"
                    required
                    value={localPassphrase}
                    onChange={(e) => setLocalPassphrase(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-sky-500/20 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    placeholder="Your secret encryption key..."
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ⚠️ **IMPORTANT:** This passphrase is used client-side to encrypt your data.
                  We **never** store it on our servers. If you forget it, your data can **never** be recovered.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 rounded-lg mt-2"
              >
                {loading ? "Please wait..." : authTab === "register" ? "Create Profile" : "Log In"}
              </Button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <Button
              type="button"
              onClick={loginWithGitHub}
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-white/10 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.505-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Continue with GitHub
            </Button>
          </div>
        )}

        {/* 4. PROFILE MODE: LOCKED ACCOUNT */}
        {mode === "profile" && isConfigured && user && !passphrase && (
          <div className="mt-8 max-w-md mx-auto rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 text-center backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 mb-4">
              🔑
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Unlock Your Encrypted Profile</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Du er logget inn som <span className="font-semibold text-slate-300">{user.email}</span>,
              men dataene dine er kryptert. Oppgi personvern-passordet ditt for å dekryptere dem klientside.
            </p>

            <form onSubmit={handleUnlockSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Privacy Passphrase
                </label>
                <input
                  type="password"
                  required
                  value={localPassphrase}
                  onChange={(e) => setLocalPassphrase(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  placeholder="Enter secret passphrase..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={logoutProfile}
                  className="flex-1 text-slate-400"
                >
                  Log Out
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white"
                >
                  Unlock
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* 5. MAIN CONTENT (Unlocked Guest or Unlocked Profile) */}
        {(mode === "guest" || (mode === "profile" && isConfigured && user && passphrase)) && (
          <>
            {mode === "profile" && (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-emerald-200 flex items-center gap-2">
                      🛡️ Profile Mode Active (Zero-Knowledge)
                    </p>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                      Your data is cryptographically synced to the cloud (Switzerland/Zürich) 🇨🇭.
                      We only see scrambled ciphertext and cannot read your inbox audit or settings.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={logoutProfile}
                    className="text-slate-400 hover:text-red-400 transition"
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            )}

            {/* LIVE INBOX SCANNER CARDS */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">1. Scan Your Old Mailbox</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your account to analyze incoming headers (the "From" domain) entirely in your browser.
                We identify linked services and suggest private, European replacements. E-mails never touch our servers.
              </p>

              {isScanning ? (
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span className="font-semibold animate-pulse">{scanStepText}</span>
                    <span className="font-mono">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      disabled={!isGoogleConfigured}
                      onClick={() => (window.location.href = getGoogleAuthUrl())}
                      className="bg-sky-600 hover:bg-sky-500 font-bold text-white shadow-md shadow-sky-600/10 px-5"
                    >
                      Connect & Scan Gmail
                    </Button>
                    <Button
                      disabled={!isMicrosoftConfigured}
                      onClick={() => (window.location.href = getMicrosoftAuthUrl())}
                      className="bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md shadow-indigo-600/10 px-5"
                    >
                      Connect & Scan Outlook / Hotmail
                    </Button>
                    <Button
                      onClick={handleDemoScan}
                      variant="outline"
                      className="border-white/10 text-slate-300 hover:bg-white/5"
                    >
                      Simulate Local Scan (Sandbox)
                    </Button>
                  </div>

                  {(!isGoogleConfigured || !isMicrosoftConfigured) && (
                    <div className="text-[11px] text-amber-400/90 leading-relaxed bg-amber-400/5 border border-amber-400/10 rounded-xl p-3 space-y-2">
                      <p className="font-semibold">⚠️ Developer Configuration Setup Required:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-400 font-medium pl-1">
                        {!isGoogleConfigured && (
                          <li>Set **`VITE_GOOGLE_CLIENT_ID`** in your **`apps/web/.env`** to enable real Gmail scanning.</li>
                        )}
                        {!isMicrosoftConfigured && (
                          <li>Set **`VITE_MICROSOFT_CLIENT_ID`** in your **`apps/web/.env`** to enable real Outlook scanning.</li>
                        )}
                      </ul>
                      <p className="text-[10px] text-slate-500 leading-normal pt-1 italic">
                        Tip: Click "Simulate Local Scan (Sandbox)" to test the full client-side parsing pipeline immediately without any keys!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* EXTENSION SYNC LINK */}
            <div className="mt-8 bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                🔗 Link Your Browser Extension
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your new secure email address (e.g. your newly created Proton Mail or Tuta address) below. 
                Our browser companion extension will instantly capture this address and use it to automatically auto-fill your fields in a single click when you launch migration guides!
              </p>
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="e.g. alex@proton.me"
                  value={targetEmail}
                  onChange={handleTargetEmailChange}
                  className="flex-1 bg-slate-950 border border-white/10 focus:border-sky-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-white"
                />
                <Button size="sm" onClick={syncTargetWithExtension} className="bg-sky-600 hover:bg-sky-500 font-bold text-white text-xs px-4">
                  Sync Link ✓
                </Button>
              </div>
            </div>

            {/* MIGRATION TARGETS */}
            <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
              <div>
                <h2 className="text-lg font-bold text-white">2. Your Migration Checklist</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Switched <span className="font-semibold text-white">{switched}</span> of{" "}
                  <span className="font-semibold text-white">{total}</span> accounts.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500 hover:text-slate-300 text-xs">
                Reset Progress
              </Button>
            </div>

            {total === 0 ? (
              <div className="mt-6 border border-dashed border-white/15 rounded-2xl p-8 text-center text-slate-500 text-sm">
                No accounts detected yet. Connect your mailbox above or run a simulated scan to fill your checklist.
              </div>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {state.accounts.map((acc) => (
                  <MigrationItemRow
                    key={acc.id}
                    acc={acc}
                    setStatus={setStatus}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {/* ========================================== */}
      {/* COZE / DIFY INTERACTIVE AI ASSISTANT CHAT  */}
      {/* ========================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-[320px] h-[400px] sm:w-[360px] sm:h-[450px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-fadeIn">
            {/* Chat Header */}
            <div className="bg-slate-950 border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">Sovereignty Advisor</h4>
                  <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online (Coze Agent)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-bold px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-sky-600 text-white rounded-br-none"
                        : "bg-slate-950 border border-white/5 text-slate-300 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-1 bg-slate-950 border border-white/5 rounded-xl rounded-bl-none px-3.5 py-2.5 max-w-[100px] text-xs">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="bg-slate-950 px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/5">
              <button
                onClick={() => triggerAiResponse("How do I move my photos? 📸")}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 rounded px-2 py-1 font-semibold transition"
              >
                📸 Move Photos
              </button>
              <button
                onClick={() => triggerAiResponse("Why Proton Mail? ✉️")}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 rounded px-2 py-1 font-semibold transition"
              >
                ✉️ Why Proton Mail
              </button>
              <button
                onClick={() => triggerAiResponse("Is this scanner safe? 🔒")}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 rounded px-2 py-1 font-semibold transition"
              >
                🔒 Scanner Safety
              </button>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleCustomChatSubmit} className="p-3 bg-slate-950 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Ask our Sovereign AI assistant..."
                className="flex-1 bg-slate-900 border border-white/10 focus:border-sky-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
              />
              <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-500 px-3 text-xs">
                Send
              </Button>
            </form>
          </div>
        )}

        {/* Floating Bubble Button */}
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-sky-500 hover:bg-sky-400 text-white shadow-xl shadow-sky-500/20 text-lg transition duration-200"
        >
          {isChatOpen ? "✕" : "💬"}
        </Button>
      </div>

    </div>
  );
}
