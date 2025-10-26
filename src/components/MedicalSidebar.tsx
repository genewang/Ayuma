import React from 'react'
import { useMedicalFlowStore } from '../stores/useMedicalFlowStore'
import { TreatmentPanel, TrialPanel, AssistancePanel, MedicationPanel } from './panels'
import { Card, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { BookOpen, Search, Heart, Pill, User, Plus } from 'lucide-react'

const MedicalSidebar: React.FC = () => {
  const {
    currentFlow,
    selectedGuideline,
    selectedTrial,
    selectedProgram,
    selectedMedication,
    patientProfile
  } = useMedicalFlowStore()

  // Render appropriate panel based on current flow
  const renderCurrentPanel = () => {
    switch (currentFlow) {
      case 'treatment':
        return <TreatmentPanel />
      case 'trials':
        return <TrialPanel />
      case 'assistance':
        return <AssistancePanel />
      case 'medications':
        return <MedicationPanel />
      default:
        return <TreatmentPanel />
    }
  }

  // Render patient profile summary
  const renderPatientProfile = () => {
    if (!patientProfile) {
      return (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Patient Profile</span>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-1" />
                Setup
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Set up your patient profile to get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Patient Profile</span>
            </div>
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Diagnosis:</span>
              <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                {patientProfile.diagnosis}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stage:</span>
              <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                {patientProfile.stage}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span className="text-xs">{patientProfile.location}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Insurance:</span>
              <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                {patientProfile.insurance}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render current selection info
  const renderCurrentSelection = () => {
    let selectionInfo = null

    switch (currentFlow) {
      case 'treatment':
        if (selectedGuideline) {
          selectionInfo = (
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{selectedGuideline.institution} Guidelines</span>
              <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                {selectedGuideline.condition}
              </Badge>
            </div>
          )
        }
        break
      case 'trials':
        if (selectedTrial) {
          selectionInfo = (
            <div className="flex items-center space-x-2 mb-2">
              <Search className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">{selectedTrial.title.substring(0, 30)}...</span>
              <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                {selectedTrial.phase}
              </Badge>
            </div>
          )
        }
        break
      case 'assistance':
        if (selectedProgram) {
          selectionInfo = (
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{selectedProgram.name}</span>
              <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                {selectedProgram.type}
              </Badge>
            </div>
          )
        }
        break
      case 'medications':
        if (selectedMedication) {
          selectionInfo = (
            <div className="flex items-center space-x-2 mb-2">
              <Pill className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium">{selectedMedication.name}</span>
              <Badge className="text-xs bg-pink-100 text-pink-800 border-pink-200">
                {selectedMedication.dosage}
              </Badge>
            </div>
          )
        }
        break
    }

    return selectionInfo ? (
      <Card className="mb-6">
        <CardContent className="p-4">
          {selectionInfo}
        </CardContent>
      </Card>
    ) : null
  }

  return (
    <div className="w-96 border-l border-border bg-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">GP</span>
          </div>
          <h1 className="text-lg font-bold">Medical GuidedPath</h1>
        </div>

        {/* Flow indicator */}
        <div className="flex items-center space-x-2 mt-3">
          <Badge
            className={`text-xs cursor-pointer transition-colors ${
              currentFlow === 'treatment'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => useMedicalFlowStore.getState().setCurrentFlow('treatment')}
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Guidelines
          </Badge>
          <Badge
            className={`text-xs cursor-pointer transition-colors ${
              currentFlow === 'trials'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => useMedicalFlowStore.getState().setCurrentFlow('trials')}
          >
            <Search className="w-3 h-3 mr-1" />
            Trials
          </Badge>
          <Badge
            className={`text-xs cursor-pointer transition-colors ${
              currentFlow === 'assistance'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => useMedicalFlowStore.getState().setCurrentFlow('assistance')}
          >
            <Heart className="w-3 h-3 mr-1" />
            Assistance
          </Badge>
          <Badge
            className={`text-xs cursor-pointer transition-colors ${
              currentFlow === 'medications'
                ? 'bg-pink-100 text-pink-800 border-pink-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => useMedicalFlowStore.getState().setCurrentFlow('medications')}
          >
            <Pill className="w-3 h-3 mr-1" />
            Medications
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          {/* Patient Profile */}
          {renderPatientProfile()}

          {/* Current Selection */}
          {renderCurrentSelection()}

          {/* Main Panel */}
          <div className="h-full">
            {renderCurrentPanel()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalSidebar
