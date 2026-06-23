import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './routes/__root'
import IndexPage from './routes/index'
import SignInPage from './routes/auth/signin'
import SignUpPage from './routes/auth/signup'
import CallbackPage from './routes/auth/callback'
import DashboardPage from './routes/dashboard'
import ResultsPage from './routes/results/$scanId'
import CancellationIndexPage from './routes/cancel/index'
import CancellationGuidePage from './routes/cancel/$id'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="auth/signin" element={<SignInPage />} />
          <Route path="auth/signup" element={<SignUpPage />} />
          <Route path="auth/callback" element={<CallbackPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="results/:scanId" element={<ResultsPage />} />
          <Route path="cancel" element={<CancellationIndexPage />} />
          <Route path="cancel/:id" element={<CancellationGuidePage />} />
        </Route>
      </Routes>
    </Router>
  )
}
