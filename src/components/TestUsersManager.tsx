import React, { useState } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

interface TestUser {
  email: string
  password: string
  fullName: string
}

const testUsers: TestUser[] = [
  {
    email: 'frontend.dev@example.com',
    password: 'Frontend123!',
    fullName: 'Alex Frontend'
  },
  {
    email: 'advisor@example.com',
    password: 'Advisor123!',
    fullName: 'Jordan Advisor'
  },
  {
    email: 'student@example.com',
    password: 'Student123!',
    fullName: 'Taylor Student'
  }
]

export const TestUsersManager: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { signIn } = useAuth()

  const createTestUser = async (user: TestUser) => {
    setLoading(user.email)
    setMessage(null)

    try {
      // First, try to sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName,
          },
        },
      })

      if (signUpError) {
        // If user already exists, try to sign in instead
        if (signUpError.message.includes('already registered')) {
          const { error: signInError } = await signIn(user.email, user.password)
          if (signInError) {
            throw signInError
          }
          setMessage(`Signed in as ${user.fullName}`)
        } else {
          throw signUpError
        }
      } else {
        setMessage(`Created and signed in as ${user.fullName}`)
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(null)
    }
  }

  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null
  }

  return (
    <Card className="mb-6 border-dashed border-primary/50">
      <CardHeader>
        <CardTitle className="text-lg text-primary">🧪 Development Test Users</CardTitle>
        <CardDescription>
          Quick login with test accounts (development mode only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {testUsers.map((user) => (
          <div key={user.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium text-sm">{user.fullName}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => createTestUser(user)}
              disabled={loading === user.email}
            >
              {loading === user.email ? 'Loading...' : 'Login'}
            </Button>
          </div>
        ))}

        {message && (
          <div className={`text-sm p-3 rounded-md ${
            message.startsWith('Error')
              ? 'bg-destructive/10 text-destructive'
              : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <strong>Note:</strong> These test users are for development only.
          In production, users should sign up normally.
        </div>
      </CardContent>
    </Card>
  )
}
