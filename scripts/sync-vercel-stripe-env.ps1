# Sync Stripe VITE_* vars from apps/web/.env to Vercel (Production + Development).
# Run from repo root: .\scripts\sync-vercel-stripe-env.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $repoRoot "apps\web\.env"
if (-not (Test-Path $envPath)) {
  Write-Error "Missing $envPath - copy from apps/web/.env.example first."
}

function Get-EnvValue($name) {
  $line = Select-String -Path $envPath -Pattern "^\s*$name\s*=" | Select-Object -First 1
  if (-not $line) { return $null }
  $raw = $line.Line -replace "^\s*$name\s*=\s*", ""
  $raw = $raw.Trim().Trim('"').Trim("'")
  return $raw
}

$stripePublic = Get-EnvValue "VITE_STRIPE_PUBLIC_KEY"
$checkoutUrl = Get-EnvValue "VITE_STRIPE_CHECKOUT_SESSION_URL"

if (-not $stripePublic) {
  Write-Error "VITE_STRIPE_PUBLIC_KEY not found in apps/web/.env"
}

Write-Host "Adding VITE_STRIPE_PUBLIC_KEY to Vercel (Production + Development)..."
$stripePublic | vercel env add VITE_STRIPE_PUBLIC_KEY production
$stripePublic | vercel env add VITE_STRIPE_PUBLIC_KEY development

if ($checkoutUrl) {
  Write-Host "Adding VITE_STRIPE_CHECKOUT_SESSION_URL..."
  $checkoutUrl | vercel env add VITE_STRIPE_CHECKOUT_SESSION_URL production
  $checkoutUrl | vercel env add VITE_STRIPE_CHECKOUT_SESSION_URL development
}

Write-Host "Done. Redeploy production: vercel --prod"
Write-Host "Verify: vercel env ls"
