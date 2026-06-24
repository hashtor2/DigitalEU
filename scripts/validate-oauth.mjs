#!/usr/bin/env node

/**
 * OAUTH_VALIDATION.mjs
 * Automated OAuth Code+PKCE validation script
 * Usage: node scripts/validate-oauth.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
}

function fileExists(filePath) {
  return fs.existsSync(path.join(PROJECT_ROOT, filePath))
}

function fileContains(filePath, pattern) {
  const fullPath = path.join(PROJECT_ROOT, filePath)
  if (!fs.existsSync(fullPath)) return null
  const content = fs.readFileSync(fullPath, 'utf-8')
  return content.includes(pattern)
}

async function main() {
  let passed = 0
  let failed = 0
  let warnings = 0

  console.log('\n' + '='.repeat(50))
  console.log('OAuth Code+PKCE Implementation Validator')
  console.log('='.repeat(50) + '\n')

  // 1. File Structure
  log.section('1. File Structure')

  const requiredFiles = [
    'apps/scanner/src/lib/oauth-utils.ts',
    'apps/scanner/src/routes/auth/email-callback.tsx',
    'apps/scanner/src/routes/auth/signin.tsx',
    'apps/scanner/src/App.tsx',
    'supabase/functions/exchange-email-code/index.ts',
  ]

  for (const file of requiredFiles) {
    if (fileExists(file)) {
      log.success(file)
      passed++
    } else {
      log.error(file)
      failed++
    }
  }

  // 2. PKCE Implementation
  log.section('2. PKCE Implementation Checks')

  const checks = [
    {
      file: 'apps/scanner/src/lib/oauth-utils.ts',
      patterns: [
        { name: 'generateCodeVerifier', pattern: 'generateCodeVerifier' },
        { name: 'generateCodeChallenge', pattern: 'generateCodeChallenge' },
        { name: 'generateRandomState', pattern: 'generateRandomState' },
        { name: 'SHA256 hashing', pattern: 'SHA-256' },
        { name: 'base64url encoding', pattern: 'base64url|b64urlEncode' },
      ],
    },
    {
      file: 'apps/scanner/src/routes/auth/email-callback.tsx',
      patterns: [
        { name: 'State validation', pattern: 'oauth_state' },
        { name: 'Code verifier retrieval', pattern: 'oauth_code_verifier' },
        { name: 'Error handling', pattern: 'error' },
        { name: 'sessionStorage cleanup', pattern: 'removeItem' },
      ],
    },
    {
      file: 'supabase/functions/exchange-email-code/index.ts',
      patterns: [
        { name: 'Token exchange', pattern: 'oauth2.googleapis.com|login.microsoftonline.com' },
        { name: 'PKCE validation', pattern: 'code_verifier' },
        { name: 'Error handling', pattern: 'error' },
      ],
    },
  ]

  for (const check of checks) {
    console.log(`\n  ${check.file}:`)
    for (const pattern of check.patterns) {
      const hasPattern = fileContains(check.file, pattern.pattern)
      if (hasPattern) {
        console.log(`    ${colors.green}✓${colors.reset} ${pattern.name}`)
        passed++
      } else {
        console.log(`    ${colors.red}✗${colors.reset} ${pattern.name}`)
        failed++
      }
    }
  }

  // 3. Security Checks
  log.section('3. Security Checks')

  // Check for console.log in Edge Function
  const edgeFuncContent = fs.readFileSync(
    path.join(PROJECT_ROOT, 'supabase/functions/exchange-email-code/index.ts'),
    'utf-8'
  )
  if (!edgeFuncContent.includes('console.log') && !edgeFuncContent.includes('console.error')) {
    log.success('No console.* statements in Edge Function (logging removed)')
    passed++
  } else {
    log.warn('Console statements found in Edge Function')
    warnings++
  }

  // Check for OAuth route
  if (fileContains('apps/scanner/src/App.tsx', 'email-callback')) {
    log.success('Email callback route registered')
    passed++
  } else {
    log.error('Email callback route missing from App.tsx')
    failed++
  }

  // 4. Environment Setup
  log.section('4. Environment Setup')

  const envFile = path.join(PROJECT_ROOT, 'apps/scanner/.env.local')
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8')
    const requiredEnvVars = [
      'VITE_GOOGLE_CLIENT_ID',
      'VITE_MICROSOFT_CLIENT_ID',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ]

    for (const envVar of requiredEnvVars) {
      if (envContent.includes(envVar)) {
        log.success(`${envVar} configured`)
        passed++
      } else {
        log.warn(`${envVar} not found in .env.local`)
        warnings++
      }
    }
  } else {
    log.warn('.env.local not found (needed for local testing)')
    warnings++
  }

  // 5. Documentation
  log.section('5. Documentation')

  const docs = [
    'docs/OAUTH_FLOW_MIGRATION.md',
    'docs/PHASE_1_IMPLEMENTATION_CHECKLIST.md',
    'docs/PHASE_1_IMPLEMENTATION_SUMMARY.md',
  ]

  for (const doc of docs) {
    if (fileExists(doc)) {
      log.success(doc)
      passed++
    } else {
      log.warn(doc)
      warnings++
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('Validation Summary')
  console.log('='.repeat(50))
  console.log(`${colors.green}✓ Passed: ${passed}${colors.reset}`)
  console.log(`${colors.yellow}⚠ Warnings: ${warnings}${colors.reset}`)
  console.log(`${colors.red}✗ Failed: ${failed}${colors.reset}`)

  if (failed === 0) {
    console.log(
      `\n${colors.green}All checks passed! Ready for local testing.${colors.reset}\n`
    )

    console.log('Next steps:')
    console.log('  1. npm run dev:scanner')
    console.log('  2. Navigate to http://localhost:5174/auth/signin')
    console.log('  3. Click "🔗 Connect Gmail" or "🔗 Connect Outlook"')
    console.log('  4. Complete OAuth flow and verify redirect')
    console.log('')

    process.exit(0)
  } else {
    console.log(`\n${colors.red}Fix the errors above before proceeding.${colors.reset}\n`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(colors.red + 'Validation error: ' + err.message + colors.reset)
  process.exit(1)
})
