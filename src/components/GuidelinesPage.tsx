import React, { useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'

const GuidelinesPage: React.FC = () => {
  const [chatMessage, setChatMessage] = useState('')

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle chat submission
    console.log('Chat message:', chatMessage)
    setChatMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Treatment Guidelines</h1>
            <p className="mt-4 text-lg text-gray-500">
              Up-to-date treatment guidelines for cancer, incorporating information from key institutions such as ASCO for cancer and EULAR for I/I diseases.
            </p>
          </div>

          {/* ChatGPT Agent Banner */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Need quick guidance?</h2>
                <p className="text-gray-600 mt-1">Open the ChatGPT agent for assistance with treatment questions.</p>
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Treatment Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Treatment Overview</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cancer Type:</span>
                  <span className="font-medium">Breast Cancer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stage:</span>
                  <span className="font-medium">Stage 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Biomarkers:</span>
                  <span className="font-medium">HER2+, ER+</span>
                </div>
              </div>

              {/* Recommended Treatment Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recommended Treatment Options</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Surgery (Lumpectomy or Mastectomy)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Chemotherapy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Radiation Therapy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Hormone Therapy (Tamoxifen/Letrozole)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Targeted Therapy (Herceptin)</span>
                  </li>
                </ul>
              </div>

              {/* Next Steps Timeline */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Next Steps Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
                    <span className="text-sm">Immediate: Surgery consultation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-500">2-4 weeks: Begin chemotherapy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-500">3-6 months: Radiation therapy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-500">5+ years: Hormone therapy</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  Prepare Questions for My Doctor
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex flex-col h-96 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Treatment Guidelines Assistant</h3>
                <p className="text-sm text-gray-500">Ask questions about your cancer treatment options</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                    <p className="text-sm">
                      Hello! I'm here to help you understand your cancer treatment guidelines.
                      What would you like to know?
                    </p>
                    <p className="text-xs mt-1 text-gray-500">10:37:56 PM</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask about your treatment options..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!chatMessage.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Questions */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Questions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
                  What are the side effects of chemotherapy?
                </button>
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
                  How long will my treatment take?
                </button>
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
                  What should I expect after surgery?
                </button>
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
                  Are there alternative treatment options?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default GuidelinesPage
