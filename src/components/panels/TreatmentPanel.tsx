import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useMedicalFlowStore } from '../../stores/useMedicalFlowStore'
import { TreatmentRecommendation } from '../../types'
import { BookOpen, ExternalLink, Heart, Star, AlertCircle } from 'lucide-react'

const TreatmentPanel: React.FC = () => {
  const { selectedGuideline, patientProfile } = useMedicalFlowStore()

  if (!selectedGuideline) {
    return (
      <div className="p-6 h-full flex items-center justify-center text-center">
        <div className="space-y-2">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">Select Treatment Guidelines</h3>
          <p className="text-sm text-muted-foreground">
            Click on a treatment node to view detailed guidelines and recommendations.
          </p>
        </div>
      </div>
    )
  }

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'chemotherapy': return 'bg-red-100 text-red-800 border-red-200'
      case 'immunotherapy': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'targeted_therapy': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'surgery': return 'bg-green-100 text-green-800 border-green-200'
      case 'radiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'supportive_care': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'weak': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isRecommendationRelevant = (rec: TreatmentRecommendation, profile: typeof patientProfile) => {
    if (!profile) return true

    // Check if recommendation matches patient stage
    if (rec.conditions?.length && !rec.conditions.includes(profile.stage)) {
      return false
    }

    return true
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">{selectedGuideline.institution} Guidelines</h2>
            </div>
            <a href={selectedGuideline.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Guidelines
              </Button>
            </a>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Evidence Level: {selectedGuideline.evidenceLevel}</span>
            <span>Last Updated: {new Date(selectedGuideline.lastUpdated).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {selectedGuideline.condition}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
              {selectedGuideline.stage}
            </Badge>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Treatment Recommendations</h3>

          <div className="space-y-4">
            {selectedGuideline.recommendations.map((recommendation) => {
              const isRelevant = isRecommendationRelevant(recommendation, patientProfile)

              return (
                <Card
                  key={recommendation.id}
                  className={`transition-all duration-200 ${
                    isRelevant
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-gray-200 bg-gray-50/50 opacity-75'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-base">
                            {recommendation.name}
                          </CardTitle>
                          <Badge className={`text-xs ${getRecommendationTypeColor(recommendation.type)}`}>
                            {recommendation.type.replace('_', ' ')}
                          </Badge>
                        </div>

                        <CardDescription className="text-sm">
                          {recommendation.description}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`text-xs ${getStrengthColor(recommendation.strength)}`}>
                          <Star className="w-3 h-3 mr-1" />
                          {recommendation.strength}
                        </Badge>
                        <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                          {recommendation.evidenceLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Conditions */}
                      {recommendation.conditions && recommendation.conditions.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Recommended for:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {recommendation.conditions.map((condition) => (
                              <Badge key={condition} className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contraindications */}
                      {recommendation.contraindications && recommendation.contraindications.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Contraindications:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {recommendation.contraindications.map((contra) => (
                              <Badge key={contra} className="text-xs bg-red-100 text-red-800 border-red-200">
                                {contra}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Relevance indicator */}
                      {patientProfile && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            {isRelevant ? (
                              <>
                                <Heart className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">
                                  Relevant for your profile
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  May not be suitable
                                </span>
                              </>
                            )}
                          </div>

                          <Button size="sm" variant="outline">
                            Add to Care Plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
          <Button className="w-full">
            Save to Care Plan
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              Compare Guidelines
            </Button>
            <Button variant="outline" className="flex-1">
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreatmentPanel
