import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import GuidelinesPage from './components/GuidelinesPage'
import TrialsPage from './components/TrialsPage'
import FinancialHelpPage from './components/FinancialHelpPage'
import MedicationPage from './components/MedicationPage'
import MyPlanPage from './components/MyPlanPage'
import AccountPage from './components/AccountPage'
import MedicalPathwayPage from './components/MedicalPathwayPage'
import { AuthProvider } from './lib/auth'
import { AuthModal } from './components/AuthModal'
import { useAuth } from './lib/auth'
import { Button } from './components/ui/Button'
import { useAppStore } from './stores/useAppStore'
import { User, LogOut, Heart } from 'lucide-react'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut, loading } = useAuth()
  const { logout } = useAppStore()

  const handleSignOut = async () => {
    await signOut()
    logout()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">GuidePath AI</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/trials" element={<TrialsPage />} />
        <Route path="/financial-help" element={<FinancialHelpPage />} />
        <Route path="/medication" element={<MedicationPage />} />
        <Route path="/my-plan" element={<MyPlanPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/pathway" element={<MedicalPathwayPage />} />
      </Routes>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
