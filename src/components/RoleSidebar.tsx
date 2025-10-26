import React from 'react'
import { useAppStore } from '../stores/useAppStore'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Progress } from './ui/Progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { RoadmapManager } from './RoadmapManager'
import { TestUsersManager } from './TestUsersManager'
import { ExternalLink, BookOpen, Video, Code, Users, CheckCircle } from 'lucide-react'

const RoleSidebar: React.FC = () => {
  const { selectedRole, skills, isAuthenticated } = useAppStore()

  if (!selectedRole) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-medium mb-2">Select a role to view details</h3>
          <p className="text-sm">Click on any role in the graph to see detailed information, requirements, and learning resources.</p>
        </div>
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800 border-green-200'
      case 'mid': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'senior': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'lead': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'principal': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Backend': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Management': return 'bg-violet-100 text-violet-800 border-violet-200'
      case 'Executive': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'doc': return <BookOpen className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'course': return <Code className="w-4 h-4" />
      case 'book': return <BookOpen className="w-4 h-4" />
      case 'tool': return <Code className="w-4 h-4" />
      default: return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Role Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getCategoryColor(selectedRole.category)}>
              {selectedRole.category}
            </Badge>
            <Badge className={getLevelColor(selectedRole.level)}>
              {selectedRole.level.charAt(0).toUpperCase() + selectedRole.level.slice(1)}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            {selectedRole.title}
          </h1>

          <p className="text-muted-foreground mb-4">
            {selectedRole.description}
          </p>

          {/* Salary Range */}
          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Salary Range</div>
            <div className="text-lg font-semibold text-foreground">
              ${selectedRole.salaryRange.min.toLocaleString()} - ${selectedRole.salaryRange.max.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Required Skills</CardTitle>
            <CardDescription>
              Skills needed for this role and your current progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRole.skills.map((skillId) => {
              const skill = skills.find(s => s.id === skillId)
              if (!skill) return null

              const progress = skill.progress || 0

              return (
                <div key={skillId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{skill.description}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Requirements */}
        {selectedRole.requirements && selectedRole.requirements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedRole.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Responsibilities */}
        {selectedRole.responsibilities && selectedRole.responsibilities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedRole.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Learning Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Resources</CardTitle>
            <CardDescription>
              Recommended resources to develop the required skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedRole.skills.map((skillId) => {
              const skill = skills.find(s => s.id === skillId)
              if (!skill || !skill.resources.length) return null

              return (
                <div key={skillId} className="space-y-2">
                  <h4 className="font-medium text-sm">{skill.name}</h4>
                  <div className="space-y-2">
                    {skill.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded border border-border hover:border-primary hover:bg-muted/50 transition-colors text-sm"
                      >
                        {getResourceIcon(resource.type)}
                        <div className="flex-1">
                          <div className="font-medium">{resource.title}</div>
                          {resource.description && (
                            <div className="text-xs text-muted-foreground">{resource.description}</div>
                          )}
                        </div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Roadmap Manager */}
        <RoadmapManager currentNodes={[]} currentEdges={[]} />

        {/* Test Users Manager (Development Only) */}
        <TestUsersManager />

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button className="w-full" variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>

          {isAuthenticated ? (
            <Button className="w-full">
              Add to My Roadmap
            </Button>
          ) : (
            <Button className="w-full" variant="outline">
              Sign In to Save Progress
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoleSidebar
