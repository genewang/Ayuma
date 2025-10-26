import React from 'react'
import { Link } from 'react-router-dom'
import MedicalPathwayVisualization from './MedicalPathwayVisualization'
import { Button } from './ui/Button'
import Navigation from './Navigation'
import Footer from './Footer'
import { useMedicalFlowStore } from '../stores/useMedicalFlowStore'

const MedicalPathwayPage: React.FC = () => {
  const { patientProfile, setPatientProfile } = useMedicalFlowStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/">← Back to Home</Link>
          </Button>

          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Medical Pathway Visualization
          </h1>
          <p className="mt-6 text-xl text-gray-500">
            AI-powered medical pathway with interactive treatment recommendations
          </p>
        </div>

        {/* Patient Selection */}
        {!patientProfile && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Patient Profile</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setPatientProfile({
                  id: '1',
                  userId: 'user-1',
                  email: 'patient1@example.com',
                  fullName: 'Sample Patient 1',
                  diagnosis: 'Breast Cancer',
                  stage: 'Stage II',
                  biomarkers: ['ER+', 'PR+', 'HER2-'],
                  previousTreatments: [],
                  location: 'San Francisco, CA',
                  insurance: 'Blue Cross Blue Shield',
                  age: 45,
                  gender: 'female',
                  performanceStatus: 0,
                  createdAt: new Date(),
                  updatedAt: new Date()
                })}
              >
                Breast Cancer - Stage II
              </Button>

              <Button
                onClick={() => setPatientProfile({
                  id: '2',
                  userId: 'user-2',
                  email: 'patient2@example.com',
                  fullName: 'Sample Patient 2',
                  diagnosis: 'Lung Cancer',
                  stage: 'Stage III',
                  biomarkers: ['EGFR+', 'PD-L1+'],
                  previousTreatments: ['Chemotherapy'],
                  location: 'New York, NY',
                  insurance: 'United Healthcare',
                  age: 62,
                  gender: 'male',
                  performanceStatus: 1,
                  createdAt: new Date(),
                  updatedAt: new Date()
                })}
              >
                Lung Cancer - Stage III
              </Button>
            </div>
          </div>
        )}

        {/* Medical Pathway Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="h-[600px] w-full">
            <MedicalPathwayVisualization
              patientData={patientProfile}
              onNodeClick={(node) => {
                console.log('Node clicked:', node)
              }}
              onEdgeClick={(edge) => {
                console.log('Edge clicked:', edge)
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MedicalPathwayPage
