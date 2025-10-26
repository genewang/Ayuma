import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs'
import MedicalPathwayVisualization from './MedicalPathwayVisualization'
import { useMedicalFlowStore } from '../stores/useMedicalFlowStore'
import { useAIMedicalQuery } from '../hooks/useAI'
import { Activity, Users, TrendingUp, Brain, Search, Filter } from 'lucide-react'

interface PatientProfile {
  id: string
  diagnosis: string
  stage: string
  biomarkers: string[]
  previousTreatments: string[]
  location: string
  insurance: string
  age?: number
  gender?: string
  ecog?: number
}

const samplePatients: PatientProfile[] = [
  {
    id: '1',
    diagnosis: 'Breast Cancer',
    stage: 'Stage II',
    biomarkers: ['ER+', 'PR+', 'HER2-'],
    previousTreatments: [],
    location: 'San Francisco, CA',
    insurance: 'Blue Cross Blue Shield',
    age: 45,
    gender: 'female',
    ecog: 0
  },
  {
    id: '2',
    diagnosis: 'Lung Cancer',
    stage: 'Stage III',
    biomarkers: ['EGFR+', 'PD-L1+'],
    previousTreatments: ['Chemotherapy'],
    location: 'New York, NY',
    insurance: 'United Healthcare',
    age: 62,
    gender: 'male',
    ecog: 1
  },
  {
    id: '3',
    diagnosis: 'Colorectal Cancer',
    stage: 'Stage IV',
    biomarkers: ['KRAS-', 'MSI-H'],
    previousTreatments: ['Surgery', 'Chemotherapy'],
    location: 'Chicago, IL',
    insurance: 'Aetna',
    age: 58,
    gender: 'female',
    ecog: 1
  }
]

const MedicalDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null)
  const [activeTab, setActiveTab] = useState('pathway')

  // Store state
  const {
    patientProfile,
    setPatientProfile,
    selectedGuideline,
    selectedTrial,
    selectedMedication
  } = useMedicalFlowStore()

  // AI hooks
  const medicalQuery = useAIMedicalQuery()
  // const insights = useAIInsights() // Not used in this component

  // Set patient profile when selected
  useEffect(() => {
    if (selectedPatient && !patientProfile) {
      setPatientProfile({
        id: selectedPatient.id,
        userId: `user-${selectedPatient.id}`,
        email: `patient${selectedPatient.id}@example.com`,
        fullName: `Patient ${selectedPatient.id}`,
        diagnosis: selectedPatient.diagnosis,
        stage: selectedPatient.stage,
        biomarkers: selectedPatient.biomarkers,
        previousTreatments: selectedPatient.previousTreatments,
        location: selectedPatient.location,
        insurance: selectedPatient.insurance,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        performanceStatus: selectedPatient.ecog,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  }, [selectedPatient, patientProfile, setPatientProfile])

  const handlePatientSelect = (patient: PatientProfile) => {
    setSelectedPatient(patient)
  }

  const handleAIQuery = async (query: string) => {
    try {
      await medicalQuery.query(query, {
        patientContext: patientProfile || {},
        onSuccess: (response) => {
          console.log('AI Query Response:', response)
        }
      })
    } catch (error) {
      console.error('AI Query failed:', error)
    }
  }

  const getPatientStats = () => {
    if (!patientProfile) return { total: 0, completed: 0, inProgress: 0 }

    return {
      total: 10,
      completed: 3,
      inProgress: 4
    }
  }

  const stats = getPatientStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GuidePath AI</h1>
              <p className="text-gray-600">AI-Powered Medical Treatment Navigation</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* AI Status */}
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">AI Backend Active</span>
            </div>

            {/* Patient Selector */}
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
                value={selectedPatient?.id || ''}
                onChange={(e) => {
                  const patient = samplePatients.find(p => p.id === e.target.value)
                  if (patient) handlePatientSelect(patient)
                }}
              >
                <option value="">Select Patient</option>
                {samplePatients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.diagnosis} - {patient.stage}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="space-y-6">
            {/* Patient Profile Card */}
            {patientProfile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Patient Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Diagnosis:</span>
                    <Badge className="bg-red-100 text-red-800">
                      {patientProfile.diagnosis}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stage:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {patientProfile.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Biomarkers:</span>
                    <div className="flex flex-wrap gap-1">
                      {patientProfile.biomarkers.map((biomarker, index) => (
                        <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                          {biomarker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance:</span>
                    <Badge className="bg-green-100 text-green-800">
                      ECOG {patientProfile.performanceStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Progress */}
            {patientProfile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Treatment Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Steps:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed:</span>
                    <span className="font-semibold text-green-600">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress:</span>
                    <span className="font-semibold text-blue-600">{stats.inProgress}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Recommendations */}
            {(selectedGuideline || selectedTrial || selectedMedication) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedGuideline && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-1">
                        Treatment Guidelines
                      </div>
                      <div className="text-xs text-blue-600">
                        {selectedGuideline.institution} - {selectedGuideline.evidenceLevel}
                      </div>
                    </div>
                  )}

                  {selectedTrial && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">
                        Clinical Trial Match
                      </div>
                      <div className="text-xs text-green-600">
                        {selectedTrial.title}
                      </div>
                    </div>
                  )}

                  {selectedMedication && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-sm font-medium text-yellow-800 mb-1">
                        Medication Assistant
                      </div>
                      <div className="text-xs text-yellow-600">
                        {selectedMedication.name} - {selectedMedication.drugClass}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleAIQuery(`What are the current treatment guidelines for ${patientProfile?.diagnosis} ${patientProfile?.stage}?`)}
                  disabled={!patientProfile}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Get AI Treatment Recommendations
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAIQuery(`Find clinical trials for ${patientProfile?.diagnosis} within 50 miles of ${patientProfile?.location}`)}
                  disabled={!patientProfile}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Find Matching Clinical Trials
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAIQuery(`Check for drug interactions for ${patientProfile?.previousTreatments?.join(' and ')}`)}
                  disabled={!patientProfile || !patientProfile.previousTreatments?.length}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Check Drug Interactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pathway">Medical Pathway</TabsTrigger>
              <TabsTrigger value="treatments">AI Treatments</TabsTrigger>
              <TabsTrigger value="trials">Clinical Trials</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
            </TabsList>

            <TabsContent value="pathway" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Interactive Medical Pathway
                  </CardTitle>
                  <CardDescription>
                    AI-powered treatment pathway visualization with evidence-based recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {patientProfile ? (
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
                  ) : (
                    <div className="h-[600px] flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Users className="w-16 h-16 mx-auto text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Select a Patient Profile
                          </h3>
                          <p className="text-gray-600">
                            Choose a patient from the sidebar to view their personalized medical pathway
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {samplePatients.map((patient) => (
                            <Button
                              key={patient.id}
                              variant="outline"
                              onClick={() => handlePatientSelect(patient)}
                            >
                              {patient.diagnosis} - {patient.stage}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Treatment Recommendations</CardTitle>
                  <CardDescription>
                    Evidence-based treatment guidelines powered by multi-LLM coordination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedGuideline ? (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">
                          {selectedGuideline.institution} Guidelines
                        </h3>
                        <p className="text-sm text-blue-600 mb-3">
                          Evidence Level: {selectedGuideline.evidenceLevel} •
                          Last Updated: {new Date(selectedGuideline.lastUpdated).toLocaleDateString()}
                        </p>
                        <div className="space-y-2">
                          {selectedGuideline.recommendations.map((rec) => (
                            <div key={rec.id} className="p-3 bg-white rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{rec.treatmentName}</h4>
                                <Badge className="bg-green-100 text-green-800">
                                  {rec.strength}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">
                          Click on a treatment node in the pathway to view AI-powered recommendations
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trials" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Trial Matching</CardTitle>
                  <CardDescription>
                    AI-powered clinical trial discovery and eligibility matching
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTrial ? (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-2">
                          {selectedTrial.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm font-medium">Phase:</span>
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              {selectedTrial.phase}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Status:</span>
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              {selectedTrial.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 mb-3">
                          {selectedTrial.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Sponsor: {selectedTrial.sponsor}
                          </div>
                          <Button size="sm">
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">
                          Click on a clinical trial node to view matching trials and eligibility details
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Management</CardTitle>
                  <CardDescription>
                    AI-powered medication assistance and interaction checking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedMedication ? (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                          {selectedMedication.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm font-medium">Class:</span>
                            <Badge className="ml-2 bg-purple-100 text-purple-800">
                              {selectedMedication.drugClass}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Strength:</span>
                            <span className="ml-2 text-sm">{selectedMedication.strength}</span>
                          </div>
                        </div>
                        <p className="text-sm text-yellow-600 mb-3">
                          {selectedMedication.indication}
                        </p>
                        {selectedMedication.sideEffects && selectedMedication.sideEffects.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium">Common Side Effects:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedMedication.sideEffects.map((effect, index) => (
                                <Badge key={index} className="text-xs bg-red-100 text-red-800">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">
                          Click on a medication node to view drug information and interaction checking
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default MedicalDashboard
