import { useState } from 'react'
import MedicalFlow from './components/MedicalFlow'
import MedicalSidebar from './components/MedicalSidebar'
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
    <div className="flex h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Medical GuidedPath</h1>
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

      {/* Main content */}
      <div className="flex flex-1 pt-16">
        {/* Main graph area */}
        <div className="flex-1 relative">
          <MedicalFlow />
        </div>

        {/* Sidebar */}
        <MedicalSidebar />
      </div>

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
