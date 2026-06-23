# Scanner Integration Design Spec
**digitaleu.me /scanner redesign — Nordic Warmth + Stripe payment flow**

---

## Color System (Tailwind v4)

```css
/* Warm cream (canvas) */
--canvas: #f9f7f2
--dark-canvas: #1a1a18

/* Terracotta accent */
--accent: #c17a5c
--accent-hover: #a86a4e

/* Text */
--text-primary: #1a1a18
--text-secondary: #6b6b6b
--dark-text-primary: #f9f7f2
--dark-text-secondary: #b8b8b8

/* Typography */
Headings: IBM Plex Mono (semibold, font-mono)
Body: System (default Tailwind)
```

---

## Routes & Flow

### 1. `/scanner` — Onboarding Entry (Unsigned/Unverified)

**Component:** `ScannerOnboarding`

**State:**
```tsx
interface ScannerState {
  step: 'entry' | 'payment' | 'verification' | 'scanning' | 'results';
  email?: string;
  paymentIntentId?: string;
  verificationToken?: string;
}
```

**Layout:**

```
┌─────────────────────────────────────────┐
│ Header: E | Europa  + [Sign in]         │
├─────────────────────────────────────────┤
│                                         │
│  Hero Section                           │
│  ├─ "Closed beta · invite only"         │
│  ├─ H1: "Scan your inbox in 2 minutes"  │
│  │    "Find your European alternatives" │
│  └─ P: "Connect Gmail (read-only)..."   │
│                                         │
│  Trust Section                          │
│  ├─ H2: "How your data is handled"      │
│  ├─ ✓ Read-only metadata                │
│  ├─ ✓ Scanned in your browser           │
│  ├─ ✕ Never sold or shared             │
│  └─ ✕ Disconnect anytime               │
│                                         │
│  Conversion CTA (Two buttons)           │
│  ├─ [Primary] "Sign up free via Proton"│
│  └─ [Secondary] "Pay €5 to unlock"     │
│                                         │
│  Text: "During beta, Gmail scanning     │
│  requires verification..."             │
└─────────────────────────────────────────┘
```

**Tailwind:**

```tsx
<div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary">
  <Header />
  
  <main className="mx-auto max-w-2xl px-6 py-16">
    {/* Badge */}
    <div className="inline-block px-3 py-1 text-xs font-mono text-accent bg-accent/10 rounded-sm mb-6">
      Closed beta · invite only
    </div>
    
    {/* Hero */}
    <h1 className="text-4xl font-mono font-semibold mb-4 text-text-primary dark:text-dark-text-primary">
      Scan your inbox in 2 minutes.
      <br />
      <span className="text-accent">Find your European alternatives.</span>
    </h1>
    
    <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-12 max-w-xl">
      Connect Gmail (read-only) and we'll recognize which services you use — then suggest privacy-first European alternatives for each one.
    </p>
    
    {/* Trust section */}
    <div className="bg-white dark:bg-dark-canvas border border-border dark:border-dark-border rounded-lg p-8 mb-12">
      <h2 className="text-sm font-mono font-semibold mb-6 text-text-primary dark:text-dark-text-primary">
        How your data is handled
      </h2>
      
      <ul className="space-y-4">
        {trustPoints.map((point) => (
          <li key={point.id} className="flex items-start gap-3">
            <span className={`text-lg flex-shrink-0 ${point.included ? 'text-green-600' : 'text-red-600'}`}>
              {point.included ? '✓' : '✕'}
            </span>
            <div>
              <p className="font-medium text-text-primary dark:text-dark-text-primary">{point.title}</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{point.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    
    {/* CTA */}
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        onClick={() => goToProtonAffiliateLink()}
        className="flex-1 h-12 bg-accent hover:bg-accent-hover text-white font-mono font-semibold rounded-lg"
      >
        Sign up free via Proton
      </Button>
      <Button
        onClick={() => setStep('payment')}
        variant="outline"
        className="flex-1 h-12 border-2 border-accent text-accent font-mono font-semibold rounded-lg hover:bg-accent/5"
      >
        Pay €5 to unlock
      </Button>
    </div>
    
    <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary mt-6">
      During beta, Gmail scanning requires verification. Choose one method above.
    </p>
  </main>
  
  <Footer />
</div>
```

---

### 2. `/scanner?step=payment` — Stripe Payment Modal

**Component:** `ScannerPaymentModal`

**Props:**
```tsx
interface ScannerPaymentModalProps {
  onPaymentSuccess: (paymentIntentId: string, email: string) => void;
  onCancel: () => void;
}
```

**Layout:**

```
┌───────────────────────────────────────┐
│ ✕ Close button (top-right)            │
├───────────────────────────────────────┤
│                                       │
│  H2: "Unlock scanner access"          │
│  P: "€5 one-time payment"             │
│                                       │
│  [Email input]                        │
│  [Stripe card input]                  │
│                                       │
│  Checkbox: "I agree to Terms..."      │
│  (Links to /terms)                    │
│                                       │
│  [Pay €5] button (disabled until      │
│  form is valid)                       │
│                                       │
│  Secure badge: 🔒 Powered by Stripe   │
│                                       │
└───────────────────────────────────────┘
```

**Tailwind:**

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-canvas dark:bg-dark-canvas rounded-lg max-w-md w-full mx-4 p-8 border border-border dark:border-dark-border">
    <button
      onClick={onCancel}
      className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
    >
      ✕
    </button>
    
    <h2 className="text-2xl font-mono font-semibold mb-2">Unlock scanner access</h2>
    <p className="text-text-secondary mb-8">€5 one-time payment</p>
    
    <form onSubmit={handlePayment} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />
      
      {/* Stripe Elements */}
      <CardElement className="p-3 border border-border rounded" />
      
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" required className="mt-1" />
        <span className="text-text-secondary">
          I agree to the{' '}
          <a href="/terms" className="text-accent underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-accent underline">Privacy Policy</a>
        </span>
      </label>
      
      <Button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full h-12 bg-accent hover:bg-accent-hover text-white font-mono font-semibold rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay €5'}
      </Button>
    </form>
    
    <p className="text-xs text-center text-text-secondary mt-6">
      🔒 Secure payment powered by Stripe
    </p>
  </div>
</div>
```

---

### 3. `/scanner?step=verification` — Email Verification

**Component:** `EmailVerificationStep`

**State after payment/Proton signup:**

```
┌─────────────────────────────────────┐
│                                     │
│  H1: "Verify your email"            │
│                                     │
│  P: "We sent a verification link    │
│     to [email]. Click it to unlock   │
│     the scanner."                   │
│                                     │
│  [Spinner] Checking verification... │
│                                     │
│  P: "Didn't receive it?"            │
│     [Resend link button]            │
│                                     │
└─────────────────────────────────────┘
```

**Tailwind:**

```tsx
<div className="min-h-screen bg-canvas dark:bg-dark-canvas flex items-center justify-center">
  <div className="max-w-md text-center">
    <h1 className="text-2xl font-mono font-semibold mb-4">Verify your email</h1>
    
    <p className="text-text-secondary mb-8">
      We sent a verification link to <strong>{email}</strong>. Click it to unlock the scanner.
    </p>
    
    <div className="flex justify-center mb-8">
      <Spinner />
    </div>
    
    <p className="text-sm text-text-secondary">
      Didn't receive it?{' '}
      <button
        onClick={resendVerificationEmail}
        className="text-accent underline hover:no-underline"
      >
        Resend link
      </button>
    </p>
  </div>
</div>
```

---

### 4. `/scanner?step=scanning` — Scanner in Progress

**Component:** `ScanProgress` (existing, restyled)

**Tailwind:** Warm cream background, terracotta progress bar.

---

### 5. `/scanner/results` — Results Page

**Component:** `ScannerResults`

**State:**

```tsx
interface ScannerResult {
  scanId: string;
  totalAccounts: number;
  europeanAlternatives: number;
  sovereigntyGrade: 'A' | 'B' | 'C' | 'D';
  sovereigntyScore: number; // 0-100
  emailCount: number;
  detectedServices: {
    domain: string;
    name: string;
    count: number;
    matchedAlternative?: {
      id: string;
      name: string;
      url: string;
    };
  }[];
}
```

**Layout:**

```
┌──────────────────────────────────────────────┐
│ E | Europa         [↻ Rescan] [Saved scans] │
├──────────────────────────────────────────────┤
│                                              │
│  H1: "653 likely accounts — 40 have swaps"  │
│  P: "Sampled 28,910 messages"               │
│                                              │
│  Sovereignty Grade Card                     │
│  ├─ Grade: D (65/100)                       │
│  ├─ "Your stack carries high sovereignty    │
│  │  risk"                                   │
│  └─ Breakdown: Google (40%), Microsoft ...  │
│                                              │
│  Detected Services                          │
│  ├─ Gmail (28 emails)                       │
│  │  → ProtonMail (alternative)              │
│  ├─ Dropbox (12 emails)                     │
│  │  → Nextcloud (alternative)               │
│  └─ ...                                     │
│                                              │
│  CTA: [Get migration plan →]                │
│  [Rescan] button                            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Component Checklist

- [ ] `ScannerOnboarding` — Entry screen with Proton/payment CTA
- [ ] `ScannerPaymentModal` — Stripe integration
- [ ] `EmailVerificationStep` — Polling & resend logic
- [ ] `ScanProgress` — Restyle for dark mode
- [ ] `ScannerResults` — Sovereignty grade, detected services, migration CTA
- [ ] `SavedScans` — List user's past scans (dashboard view)
- [ ] Integration with auth state (2FA-ready, but not required for MVP)
- [ ] Stripe webhook handler (Edge Function or serverless)

---

## Data Flow

```
Unverified user visits /scanner
  ↓
Choose: Proton affiliate OR Pay €5
  ↓
[Proton] Redirect to affiliate link (Gmail verified by Proton)
[Pay] Show Stripe modal → success → send verification email
  ↓
User clicks email link
  ↓
Email verified → `user_scanner_metadata.gmail_verified = true`
  ↓
Scanner unlocked → scan Gmail → save results
  ↓
Results page → "Get migration plan" button (next phase)
```

---

## Stripe Integration Checklist

- [ ] Create Stripe API keys (test + live)
- [ ] Create `/api/create-payment-intent` endpoint
- [ ] Create `/api/stripe-webhook` endpoint (listens for `payment_intent.succeeded`)
- [ ] On success: Send verification email, set `scanner_access_type = 'paid_stripe'`
- [ ] Error handling: Retry UI, clear error messages

---

## Migration Dates

| Phase | Target |
|-------|--------|
| Design approval | This week |
| Component build | Next week |
| Stripe integration | Following week |
| E2E testing | Before launch |
