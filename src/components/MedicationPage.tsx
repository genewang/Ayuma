import React, { useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string
  isTaken: boolean
  sideEffects: string[]
}

const MedicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('medications')

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Tamoxifen',
      dosage: '20mg',
      frequency: 'Daily',
      timing: 'Morning',
      isTaken: false,
      sideEffects: ['Hot flashes', 'Fatigue']
    },
    {
      id: '2',
      name: 'Herceptin',
      dosage: '440mg',
      frequency: 'Every 3 weeks',
      timing: 'Infusion',
      isTaken: true,
      sideEffects: ['Heart issues', 'Infusion reaction']
    },
    {
      id: '3',
      name: 'Zofran',
      dosage: '8mg',
      frequency: 'As needed',
      timing: 'Before meals',
      isTaken: false,
      sideEffects: ['Headache', 'Constipation']
    }
  ])

  const tabs = [
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'side-effects', label: 'Side Effects', icon: '📊' },
    { id: 'care-team', label: 'Care Team', icon: '💬' },
    { id: 'visit-summaries', label: 'Visit Summaries', icon: '📋' }
  ]

  const toggleMedication = (id: string) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, isTaken: !med.isTaken } : med
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Medication Management</h1>
            <p className="mt-4 text-lg text-gray-500">
              Medication scheduling and reminders, interaction alerts, side-effect monitoring, and pharmacy integration.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Medications Tab Content */}
          {activeTab === 'medications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Today's Medications</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  Add Medication
                </button>
              </div>

              <div className="grid gap-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={medication.isTaken}
                          onChange={() => toggleMedication(medication.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                          <p className="text-sm text-gray-500">
                            {medication.dosage} • {medication.frequency} • {medication.timing}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                          Info
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Common Side Effects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {medication.sideEffects.map((effect, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side Effects Tab Content */}
          {activeTab === 'side-effects' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Side Effects Tracking</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Track and monitor side effects from your medications. Coming soon...</p>
              </div>
            </div>
          )}

          {/* Care Team Tab Content */}
          {activeTab === 'care-team' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Care Team Communication</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Connect with your healthcare providers and care team. Coming soon...</p>
              </div>
            </div>
          )}

          {/* Visit Summaries Tab Content */}
          {activeTab === 'visit-summaries' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Visit Summaries</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Access summaries from your medical appointments. Coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MedicationPage
