import React, { useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'

interface ClinicalTrial {
  id: string
  title: string
  location: string
  phase: string
  status: string
  description: string
  eligibility: string[]
  phaseColor: string
  statusColor: string
}

const TrialsPage: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState('All Phases')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')

  const clinicalTrials: ClinicalTrial[] = [
    {
      id: '1',
      title: 'Novel Immunotherapy for Breast Cancer',
      location: 'Memorial Sloan Kettering, New York',
      phase: 'Phase 2',
      status: 'Recruiting',
      description: 'Testing a new immunotherapy drug in combination with standard chemotherapy.',
      eligibility: ['HER2+', 'Stage 2-3', 'Age 18-75'],
      phaseColor: 'bg-yellow-100 text-yellow-800',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '2',
      title: 'Targeted Therapy Study',
      location: 'MD Anderson, Houston',
      phase: 'Phase 3',
      status: 'Recruiting',
      description: 'Comparing targeted therapy with standard hormone therapy.',
      eligibility: ['ER+', 'Stage 1-3', 'No prior treatment'],
      phaseColor: 'bg-green-100 text-green-800',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '3',
      title: 'Precision Medicine Trial',
      location: 'UCLA Medical Center, Los Angeles',
      phase: 'Phase 1',
      status: 'Recruiting',
      description: 'Personalized treatment based on genetic markers.',
      eligibility: ['Any stage', 'Biomarker positive', 'Failed standard treatment'],
      phaseColor: 'bg-blue-100 text-blue-800',
      statusColor: 'bg-green-100 text-green-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Clinical Trial Finder</h1>
            <p className="mt-4 text-lg text-gray-500">
              Trial search by disease type, stage, location, and therapy. Interactive questionnaire helps patients determine their eligibility based on specific disease characteristics and medical history.
            </p>
          </div>

          {/* ChatGPT Agent Banner */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Need help choosing trials?</h2>
                <p className="text-gray-600 mt-1">Open the ChatGPT agent to get guidance and eligibility insights.</p>
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

          {/* Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Trials</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trial Phase</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                >
                  <option value="All Phases">All Phases</option>
                  <option value="Phase 1">Phase 1</option>
                  <option value="Phase 2">Phase 2</option>
                  <option value="Phase 3">Phase 3</option>
                  <option value="Phase 4">Phase 4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="All Locations">All Locations</option>
                  <option value="New York">New York</option>
                  <option value="Houston">Houston</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clinical Trials List */}
          <div className="space-y-6">
            {clinicalTrials.map((trial) => (
              <div key={trial.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{trial.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{trial.location}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${trial.phaseColor}`}>
                      {trial.phase}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${trial.statusColor}`}>
                      {trial.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{trial.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility Criteria:</h4>
                  <div className="flex flex-wrap gap-2">
                    {trial.eligibility.map((criteria, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                        {criteria}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Learn More
                  </button>
                  <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Contact Study Site
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TrialsPage
