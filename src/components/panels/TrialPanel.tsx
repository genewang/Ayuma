import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useTrialStore } from '../../stores/useTrialStore'
import { useMedicalFlowStore } from '../../stores/useMedicalFlowStore'
import { ClinicalTrial } from '../../types'
import { Search, MapPin, Users, Clock, Filter, CheckCircle, Bookmark, BookmarkCheck } from 'lucide-react'

const TrialPanel: React.FC = () => {
  const { eligibleTrials, savedTrials, filters, loading } = useTrialStore()
  const { patientProfile, setSelectedTrial } = useMedicalFlowStore()
  const [showFilters, setShowFilters] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-green-100 text-green-800 border-green-200'
      case 'active_not_recruiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'phase 1': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'phase 2': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'phase 3': return 'bg-green-100 text-green-800 border-green-200'
      case 'phase 4': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateMatchScore = (trial: ClinicalTrial) => {
    if (!patientProfile) return 0

    let score = 0

    // Diagnosis match (40 points)
    if (trial.conditions.includes(patientProfile.diagnosis)) score += 40

    // Stage match (20 points)
    const stageMatch = trial.conditions.some(condition =>
      condition.toLowerCase().includes(patientProfile.stage.toLowerCase())
    )
    if (stageMatch) score += 20

    // Biomarker match (20 points)
    if (trial.eligibility.biomarkers?.length) {
      const biomarkerMatch = trial.eligibility.biomarkers.some(biomarker =>
        patientProfile.biomarkers.includes(biomarker)
      )
      if (biomarkerMatch) score += 20
    }

    // Location match (10 points)
    if (trial.locations.some(location => isLocationNearby(location, patientProfile.location))) {
      score += 10
    }

    // Treatment history (10 points)
    if (trial.eligibility.previousTreatments?.length) {
      const treatmentMatch = trial.eligibility.previousTreatments.some(treatment =>
        patientProfile.previousTreatments.includes(treatment)
      )
      if (treatmentMatch) score += 10
    }

    return score
  }

  const isLocationNearby = (location: any, patientLocation: string) => {
    // Simple check - in real implementation would use geocoding
    if (location.distance !== undefined && location.distance <= 50) {
      return true
    }
    // Fallback: check if same state
    return location.state?.toLowerCase() === patientLocation.toLowerCase()
  }

  const handleTrialClick = (trial: ClinicalTrial) => {
    setSelectedTrial(trial)
  }

  const formatConditions = (conditions: string[]) => {
    if (conditions.length <= 2) return conditions.join(', ')
    return `${conditions.slice(0, 2).join(', ')} +${conditions.length - 2}`
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Searching for trials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Clinical Trials</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button size="sm">
                Start Eligibility Quiz
              </Button>
            </div>
          </div>

          {/* Search and stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Found {eligibleTrials.length} matching trials</span>
            {patientProfile && (
              <span>Based on your {patientProfile.diagnosis} profile</span>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phase</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map(phase => (
                      <Badge
                        key={phase}
                        className={`cursor-pointer text-xs ${
                          filters.phase?.includes(phase)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {phase}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['Recruiting', 'Active', 'Completed'].map(status => (
                      <Badge
                        key={status}
                        className={`cursor-pointer text-xs ${
                          filters.status?.includes(status.toLowerCase())
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trials List */}
        <div className="space-y-4">
          {eligibleTrials.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No trials found</h3>
                <p className="text-muted-foreground mb-4">
                  No clinical trials match your current criteria. Try adjusting your filters or complete the eligibility questionnaire.
                </p>
                <Button>Take Eligibility Quiz</Button>
              </CardContent>
            </Card>
          ) : (
            eligibleTrials.map((trial) => {
              const matchScore = calculateMatchScore(trial)
              const isSaved = savedTrials.includes(trial.id)

              return (
                <Card
                  key={trial.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-md"
                  onClick={() => handleTrialClick(trial)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-base leading-tight">
                            {trial.title}
                          </CardTitle>
                          {isSaved && (
                            <BookmarkCheck className="w-4 h-4 text-blue-600" />
                          )}
                        </div>

                        <CardDescription className="text-sm">
                          NCT{trial.nctId} • {trial.conditions[0]}
                        </CardDescription>

                        <div className="flex flex-wrap gap-1">
                          <Badge className={`text-xs ${getStatusColor(trial.status)}`}>
                            {trial.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={`text-xs ${getPhaseColor(trial.phase)}`}>
                            {trial.phase}
                          </Badge>
                          {matchScore >= 80 && (
                            <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                              High Match
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                matchScore >= 80 ? 'bg-green-500' :
                                matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${matchScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{matchScore}%</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{trial.locations.length} location{trial.locations.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{trial.locations[0]?.facility}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Started {new Date(trial.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{formatConditions(trial.conditions)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          Interventions: {trial.interventions.slice(0, 2).join(', ')}
                          {trial.interventions.length > 2 && ` +${trial.interventions.length - 2}`}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default TrialPanel
