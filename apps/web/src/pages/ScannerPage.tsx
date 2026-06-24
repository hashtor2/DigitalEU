import { Routes, Route } from 'react-router-dom'
import ScannerLayout from './scanner/__root'
import IndexPage from './scanner/index'
import DemoScanPage from './scanner/scan'
import SignInPage from './scanner/auth/signin'
import SignUpPage from './scanner/auth/signup'
import CallbackPage from './scanner/auth/callback'
import EmailCallbackPage from './scanner/auth/email-callback'
import DashboardPage from './scanner/dashboard'
import ResultsPage from './scanner/results/$scanId'
import CancellationIndexPage from './scanner/cancel/index'
import CancellationGuidePage from './scanner/cancel/$id'
import ReportPage from './scanner/report/$sessionId'

export function ScannerPage() {
  return (
    <Routes>
      <Route element={<ScannerLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="scan" element={<DemoScanPage />} />
        <Route path="auth/signin" element={<SignInPage />} />
        <Route path="auth/signup" element={<SignUpPage />} />
        <Route path="auth/callback" element={<CallbackPage />} />
        <Route path="auth/email-callback" element={<EmailCallbackPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="results/:scanId" element={<ResultsPage />} />
        <Route path="report/:sessionId" element={<ReportPage />} />
        <Route path="cancel" element={<CancellationIndexPage />} />
        <Route path="cancel/:id" element={<CancellationGuidePage />} />
      </Route>
    </Routes>
  )
}
