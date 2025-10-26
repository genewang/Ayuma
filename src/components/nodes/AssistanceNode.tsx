import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { AssistanceProgram } from '../../types'
import { Badge } from '../ui/Badge'
import { Heart, DollarSign, Shield, Users } from 'lucide-react'

interface AssistanceNodeData {
  title: string
  program: AssistanceProgram
  isSelected?: boolean
  isCompleted?: boolean
  isSaved?: boolean
  eligibilityScore?: number
  metadata?: Record<string, any>
}

const AssistanceNode: React.FC<NodeProps<AssistanceNodeData>> = ({ data, selected }) => {
  const { title, program, isSelected, isCompleted, isSaved, eligibilityScore } = data

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign className="w-3 h-3 text-green-600" />
      case 'support': return <Heart className="w-3 h-3 text-red-600" />
      case 'insurance': return <Shield className="w-3 h-3 text-blue-600" />
      case 'referral': return <Users className="w-3 h-3 text-purple-600" />
      default: return <Heart className="w-3 h-3 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800 border-green-200'
      case 'support': return 'bg-red-100 text-red-800 border-red-200'
      case 'insurance': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'referral': return 'bg-purple-100 text-purple-800 border-purple-200'
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
        min-w-[220px] max-w-[300px]
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
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
            {getTypeIcon(program.type)}
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {title || program.name}
          </h3>
        </div>

        {/* Program type and category */}
        <div className="flex flex-wrap gap-1">
          <Badge className={`text-xs ${getTypeColor(program.type)}`}>
            {program.type}
          </Badge>
          <Badge className={`text-xs ${getCategoryColor(program.category)}`}>
            {program.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {program.description}
        </p>

        {/* Eligibility score */}
        {eligibilityScore !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  eligibilityScore >= 80 ? 'bg-green-500' :
                  eligibilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${eligibilityScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {eligibilityScore}%
            </span>
          </div>
        )}

        {/* Requirements preview */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Requirements:</span>
          <div className="mt-1 space-y-1">
            {program.requirements.slice(0, 2).map((req, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                {req}
              </div>
            ))}
            {program.requirements.length > 2 && (
              <div className="text-muted-foreground">
                +{program.requirements.length - 2} more
              </div>
            )}
          </div>
        </div>

        {/* Benefits preview */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Benefits:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {program.benefits.slice(0, 3).map((benefit, index) => (
              <span key={index} className="inline-block">
                {benefit}{index < Math.min(program.benefits.length, 3) - 1 ? ', ' : ''}
              </span>
            ))}
            {program.benefits.length > 3 && (
              <span className="text-muted-foreground">
                +{program.benefits.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Contact:</span> {program.contact}
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

export default AssistanceNode
