import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import Navigation from './Navigation'
import Footer from './Footer'

const AccountPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showAuth={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/">← Back to Home</Link>
          </Button>

          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Account Settings
          </h1>
          <p className="mt-6 text-xl text-gray-500">
            Manage your account settings and preferences
          </p>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                Our account management system is currently under development.
                Features will include:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">👤</div>
                  <h3 className="font-semibold text-gray-900">Profile Management</h3>
                  <p className="text-sm text-gray-600">Update personal information</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">🔐</div>
                  <h3 className="font-semibold text-gray-900">Security Settings</h3>
                  <p className="text-sm text-gray-600">Password and privacy controls</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">🔔</div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">Manage alerts and reminders</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-gray-900">Data Export</h3>
                  <p className="text-sm text-gray-600">Download your medical data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AccountPage
