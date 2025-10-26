import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import Navigation from './Navigation'
import Footer from './Footer'

const MyPlanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/">← Back to Home</Link>
          </Button>

          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            My Personalized Plan
          </h1>
          <p className="mt-6 text-xl text-gray-500">
            Create and manage your personalized cancer treatment journey
          </p>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                Our personalized treatment planning system is currently under development.
                Features will include:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-semibold text-gray-900">Treatment Plans</h3>
                  <p className="text-sm text-gray-600">Personalized treatment schedules</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
                  <p className="text-sm text-gray-600">Monitor treatment progress</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">🤖</div>
                  <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
                  <p className="text-sm text-gray-600">AI-powered treatment suggestions</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-semibold text-gray-900">Mobile Access</h3>
                  <p className="text-sm text-gray-600">Access your plan anywhere</p>
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

export default MyPlanPage
