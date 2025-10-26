import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { ClinicalTrial } from '../../types'
import { Badge } from '../ui/Badge'
import { Search, MapPin, Users, Clock } from 'lucide-react'

interface TrialNodeData {
  title: string
  trial: ClinicalTrial
  matchScore?: number
  isSelected?: boolean
  isCompleted?: boolean
  isSaved?: boolean
  metadata?: Record<string, any>
}

const TrialNode: React.FC<NodeProps<TrialNodeData>> = ({ data, selected }) => {
  const { title, trial, matchScore, isSelected, isCompleted, isSaved } = data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-green-100 text-green-800 border-green-200'
      case 'active_not_recruiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200'
      case 'withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'phase 1': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'phase 2': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'phase 3': return 'bg-green-100 text-green-800 border-green-200'
      case 'phase 4': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'early phase 1': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatConditions = (conditions: string[]) => {
    if (conditions.length <= 2) return conditions.join(', ')
    return `${conditions.slice(0, 2).join(', ')} +${conditions.length - 2}`
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${selected || isSelected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50 hover:shadow-md'
        }
        ${isCompleted ? 'bg-green-50/50' : 'bg-card'}
        ${isSaved ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
        min-w-[240px] max-w-[320px]
      `}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />

      {/* Node content */}
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Search className="w-3 h-3 text-green-600" />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {title || trial.title.substring(0, 40)}...
          </h3>
        </div>

        {/* Trial ID */}
        <div className="text-xs text-muted-foreground font-mono">
          {trial.nctId}
        </div>

        {/* Status and Phase */}
        <div className="flex flex-wrap gap-1">
          <Badge className={`text-xs ${getStatusColor(trial.status)}`}>
            {trial.status.replace('_', ' ')}
          </Badge>
          <Badge className={`text-xs ${getPhaseColor(trial.phase)}`}>
            {trial.phase}
          </Badge>
        </div>

        {/* Conditions */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Conditions:</span> {formatConditions(trial.conditions)}
        </div>

        {/* Match score */}
        {matchScore !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  matchScore >= 80 ? 'bg-green-500' :
                  matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {matchScore}%
            </span>
          </div>
        )}

        {/* Locations */}
        <div className="text-xs text-muted-foreground flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {trial.locations.length} location{trial.locations.length !== 1 ? 's' : ''}
        </div>

        {/* Enrollment */}
        {trial.locations.length > 0 && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {trial.locations[0].facility}
          </div>
        )}

        {/* Start date */}
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Started {new Date(trial.startDate).toLocaleDateString()}
        </div>

        {/* Saved indicator */}
        {isSaved && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
          </div>
        )}

        {/* Completion indicator */}
        {isCompleted && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrialNode
