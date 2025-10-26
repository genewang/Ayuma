import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import Navigation from './Navigation'
import Footer from './Footer'

const TrialsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/">← Back to Home</Link>
          </Button>

          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Clinical Trial Finder
          </h1>
          <p className="mt-6 text-xl text-gray-500">
            Find clinical trials that match your diagnosis and treatment needs
          </p>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                Our clinical trial matching system is currently under development.
                Features will include:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">🔬</div>
                  <h3 className="font-semibold text-gray-900">Trial Matching</h3>
                  <p className="text-sm text-gray-600">AI-powered eligibility matching</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📍</div>
                  <h3 className="font-semibold text-gray-900">Location Search</h3>
                  <p className="text-sm text-gray-600">Find trials near you</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-semibold text-gray-900">Eligibility Check</h3>
                  <p className="text-sm text-gray-600">Interactive questionnaires</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-900">Real-time Updates</h3>
                  <p className="text-sm text-gray-600">Live trial status updates</p>
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

export default TrialsPage
