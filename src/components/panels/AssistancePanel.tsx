import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useUserStore } from '../../stores/useUserStore'
import { useMedicalFlowStore } from '../../stores/useMedicalFlowStore'
import { AssistanceProgram } from '../../types'
import { Heart, DollarSign, Shield, Users, Bookmark, BookmarkCheck, MapPin, Phone } from 'lucide-react'

const AssistancePanel: React.FC = () => {
  const { assistancePrograms, savedPrograms } = useUserStore()
  const { patientProfile, setSelectedProgram } = useMedicalFlowStore()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Programs', icon: Heart, color: 'bg-blue-100 text-blue-800' },
    { id: 'financial', name: 'Financial Aid', icon: DollarSign, color: 'bg-green-100 text-green-800' },
    { id: 'support', name: 'Support Groups', icon: Users, color: 'bg-purple-100 text-purple-800' },
    { id: 'insurance', name: 'Insurance Navigation', icon: Shield, color: 'bg-blue-100 text-blue-800' },
    { id: 'referral', name: 'Referrals', icon: Heart, color: 'bg-red-100 text-red-800' },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign className="w-4 h-4 text-green-600" />
      case 'support': return <Users className="w-4 h-4 text-purple-600" />
      case 'insurance': return <Shield className="w-4 h-4 text-blue-600" />
      case 'referral': return <Heart className="w-4 h-4 text-red-600" />
      case 'transportation': return <MapPin className="w-4 h-4 text-yellow-600" />
      case 'medication': return <Heart className="w-4 h-4 text-pink-600" />
      default: return <Heart className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800 border-green-200'
      case 'support': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'insurance': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'referral': return 'bg-red-100 text-red-800 border-red-200'
      case 'transportation': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'medication': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'patient assistance': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'financial aid': return 'bg-green-50 text-green-700 border-green-200'
      case 'support groups': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'insurance navigation': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const checkEligibility = (program: AssistanceProgram) => {
    if (!patientProfile) return 0

    let score = 0

    // Condition match (40 points)
    if (program.eligibility.conditions.includes(patientProfile.diagnosis)) score += 40

    // Insurance match (30 points)
    if (program.eligibility.insuranceTypes.includes(patientProfile.insurance)) score += 30

    // Age match (15 points)
    if (program.eligibility.ageRange) {
      if (patientProfile.age &&
          patientProfile.age >= program.eligibility.ageRange.min &&
          patientProfile.age <= program.eligibility.ageRange.max) {
        score += 15
      }
    } else {
      score += 15 // No age restriction
    }

    // Location match (15 points)
    if (program.eligibility.location?.length) {
      if (program.eligibility.location.includes(patientProfile.location)) {
        score += 15
      }
    } else {
      score += 15 // No location restriction
    }

    return score
  }

  const filteredPrograms = activeCategory === 'all'
    ? assistancePrograms
    : assistancePrograms.filter(program => program.type === activeCategory)

  const handleProgramClick = (program: AssistanceProgram) => {
    setSelectedProgram(program)
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Patient Assistance</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Find support groups, financial aid, insurance navigation, and specialist referrals tailored to your needs.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Programs Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {activeCategory === 'all' ? 'All Programs' : categories.find(c => c.id === activeCategory)?.name}
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredPrograms.length} programs
            </span>
          </div>

          {filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No programs found</h3>
                <p className="text-muted-foreground">
                  No assistance programs match your current criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredPrograms.map((program) => {
                const eligibilityScore = checkEligibility(program)
                const isSaved = savedPrograms.includes(program.id)

                return (
                  <Card
                    key={program.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => handleProgramClick(program)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              {getTypeIcon(program.type)}
                            </div>
                            <CardTitle className="text-base leading-tight">
                              {program.name}
                            </CardTitle>
                            {isSaved && (
                              <BookmarkCheck className="w-4 h-4 text-blue-600" />
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            <Badge className={`text-xs ${getTypeColor(program.type)}`}>
                              {program.type}
                            </Badge>
                            <Badge className={`text-xs ${getCategoryColor(program.category)}`}>
                              {program.category}
                            </Badge>
                            {eligibilityScore >= 80 && (
                              <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                                High Match
                              </Badge>
                            )}
                          </div>

                          <CardDescription className="text-sm">
                            {program.description}
                          </CardDescription>
                        </div>

                        <div className="text-right space-y-2">
                          {eligibilityScore > 0 && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    eligibilityScore >= 80 ? 'bg-green-500' :
                                    eligibilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${eligibilityScore}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{eligibilityScore}%</span>
                            </div>
                          )}
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Requirements */}
                        {program.requirements.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">
                              Requirements:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {program.requirements.slice(0, 3).map((req, index) => (
                                <Badge key={index} className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                                  {req}
                                </Badge>
                              ))}
                              {program.requirements.length > 3 && (
                                <Badge className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                                  +{program.requirements.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Benefits */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Benefits:
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {program.benefits.slice(0, 2).join(', ')}
                            {program.benefits.length > 2 && ` +${program.benefits.length - 2} more`}
                          </p>
                        </div>

                        {/* Contact */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{program.contact}</span>
                            </div>
                            {program.eligibility.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{program.eligibility.location.join(', ')}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Learn More
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssistancePanel
