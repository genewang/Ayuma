import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import Navigation from './Navigation'
import Footer from './Footer'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main>
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                We're here to guide you through every step.
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
                Your personalized cancer care companion, providing clear guidance on treatment options, clinical trials, and support resources.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200">
                  <Link to="/my-plan">
                    Start Your Journey
                  </Link>
                </Button>

                <Button asChild variant="outline" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200">
                  <Link to="/guidelines">
                    Already have a diagnosis?
                  </Link>
                </Button>
              </div>
            </div>

            {/* Cancer Care Journey */}
            <div className="mt-20">
              <h2 className="text-center text-2xl font-bold text-gray-900">Your Cancer Care Journey</h2>

              <div className="mt-8 flex justify-center">
                <div className="w-full max-w-4xl">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">Diagnosis</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">Plan</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">Trials</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        4
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">Support</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-1 bg-gray-200">
                      <div className="h-1 bg-indigo-600 w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Can Help */}
            <div className="mt-20">
              <h2 className="text-center text-2xl font-bold text-gray-900">How We Can Help</h2>

              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Link
                  to="/guidelines"
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-3xl mb-4">💊</div>
                  <h3 className="text-lg font-medium text-gray-900">Treatment Guidelines</h3>
                  <p className="mt-2 text-gray-500">
                    Up-to-date treatment guidelines for cancer, incorporating information from key institutions such as ASCO for cancer and EULAR for I/I diseases.
                  </p>
                </Link>

                <Link
                  to="/trials"
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-3xl mb-4">🔬</div>
                  <h3 className="text-lg font-medium text-gray-900">Clinical Trial Finder</h3>
                  <p className="mt-2 text-gray-500">
                    Trial search by disease type, stage, location, and therapy. An interactive questionnaire helps determine eligibility based on disease characteristics and history.
                  </p>
                </Link>

                <Link
                  to="/financial-help"
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-3xl mb-4">💰</div>
                  <h3 className="text-lg font-medium text-gray-900">Patient Assistance</h3>
                  <p className="mt-2 text-gray-500">
                    Support groups, insurance navigation, specialist referrals, and financial aid programs tailored to your needs.
                  </p>
                </Link>

                <Link
                  to="/medication"
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-3xl mb-4">🤝</div>
                  <h3 className="text-lg font-medium text-gray-900">Medication Management</h3>
                  <p className="mt-2 text-gray-500">
                    Scheduling and reminders, interaction alerts, side-effect tracking, and pharmacy integration.
                  </p>
                </Link>
              </div>
            </div>

            {/* Advanced AI Features */}
            <div className="mt-20">
              <h2 className="text-center text-2xl font-bold text-gray-900">Advanced AI Features</h2>

              <div className="mt-12 flex justify-center">
                <Link
                  to="/pathway"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 max-w-2xl text-center"
                >
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Medical Pathway</h3>
                  <p className="text-indigo-100">
                    Experience our advanced React Flow medical pathway visualization with interactive AI recommendations, clinical trial matching, and comprehensive treatment guidance powered by multi-LLM coordination.
                  </p>
                  <div className="mt-4 text-sm text-indigo-200">
                    Click to explore the full AI medical guidance system →
                  </div>
                </Link>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-20 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Ready to take control of your care?</h2>
                <p className="mt-4 text-gray-500">
                  Get personalized guidance, find clinical trials, and connect with support resources.
                </p>

                <div className="mt-6">
                  <Button asChild className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                    <Link to="/my-plan">
                      Create Your Personalized Plan
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
