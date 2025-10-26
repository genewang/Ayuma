import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">GP</span>
              </div>
              <span className="text-xl font-bold">GuidePath AI</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering patients with personalized cancer treatment guidance and support through advanced AI technology.
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 GuidePath AI. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/guidelines" className="text-gray-300 hover:text-white transition-colors">
                  Treatment Guidelines
                </Link>
              </li>
              <li>
                <Link to="/trials" className="text-gray-300 hover:text-white transition-colors">
                  Clinical Trials
                </Link>
              </li>
              <li>
                <Link to="/financial-help" className="text-gray-300 hover:text-white transition-colors">
                  Patient Assistance
                </Link>
              </li>
              <li>
                <Link to="/medication" className="text-gray-300 hover:text-white transition-colors">
                  Medication Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/my-plan" className="text-gray-300 hover:text-white transition-colors">
                  Create Your Plan
                </Link>
              </li>
              <li>
                <Link to="/pathway" className="text-gray-300 hover:text-white transition-colors">
                  AI Pathway
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-300 hover:text-white transition-colors">
                  Account Settings
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            This application is for informational purposes only and should not replace professional medical advice.
            Always consult with healthcare providers for medical decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
