import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { EnvironmentDetail } from './pages/EnvironmentDetail'
import { ParameterDetail } from './pages/ParameterDetail'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/environment/:id" element={<EnvironmentDetail />} />
          <Route path="/environment/:id/parameter/:parameterId" element={<ParameterDetail />} />
        </Routes>
      </Layout>
      <Toaster />
    </ThemeProvider>
  )
}

export default App 