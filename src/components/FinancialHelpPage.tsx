import React from 'react'
import Navigation from './Navigation'
import Footer from './Footer'

interface AssistanceService {
  id: string
  icon: string
  title: string
  description: string
  buttonText: string
  buttonColor?: string
}

const FinancialHelpPage: React.FC = () => {
  const assistanceServices: AssistanceService[] = [
    {
      id: 'copay',
      icon: '💰',
      title: 'Copay Assistance',
      description: 'Find programs that help cover your medication copays and out-of-pocket costs.',
      buttonText: 'Find Programs',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'insurance',
      icon: '🏥',
      title: 'Insurance Help',
      description: 'Get help understanding your insurance coverage and appealing denials.',
      buttonText: 'Get Help',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'disability',
      icon: '📋',
      title: 'Disability & FMLA',
      description: 'Navigate disability benefits and family medical leave options.',
      buttonText: 'Learn More',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'transportation',
      icon: '🚗',
      title: 'Transportation',
      description: 'Find transportation assistance for medical appointments.',
      buttonText: 'Find Rides',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'housing',
      icon: '🏠',
      title: 'Housing',
      description: 'Find temporary housing near treatment centers.',
      buttonText: 'Find Housing',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'counselor',
      icon: '👥',
      title: 'Financial Counselor',
      description: 'Connect with a financial counselor for personalized assistance.',
      buttonText: 'Get Connected',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Patient Assistance</h1>
            <p className="mt-4 text-lg text-gray-500">
              Support and Advocacy Groups, Insurance Navigation, Specialist Referrals, and Financial Assistance programs tailored to your situation.
            </p>
          </div>

          {/* ChatGPT Agent Banner */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Need personalized assistance?</h2>
                <p className="text-gray-600 mt-1">Open the ChatGPT agent for quick navigation and recommendations.</p>
              </div>
              <a
                href="https://chatgpt.com/gpts/editor/g-Yi6gqfesN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Open ChatGPT Agent
              </a>
            </div>
          </div>

          {/* Assistance Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistanceServices.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${service.buttonColor}`}>
                  {service.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Emergency Financial Assistance */}
          <div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Financial Assistance</h2>
            <p className="text-gray-600 mb-6">
              If you're facing immediate financial hardship due to your cancer treatment, we can help connect you with emergency assistance programs.
            </p>
            <button className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
              Request Emergency Assistance
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default FinancialHelpPage
