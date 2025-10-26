import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Badge } from '../ui/Badge'
import { TrendingUp, Clock, Heart } from 'lucide-react'

interface OutcomeNodeData {
  label: string
  survival?: string
  recurrence?: string
  qualityOfLife?: string
  followUp?: string
  prognosis?: string
  isSelected?: boolean
  isCompleted?: boolean
  metadata?: Record<string, any>
}

const OutcomeNode: React.FC<NodeProps<OutcomeNodeData>> = ({ data, selected }) => {
  const {
    label,
    survival,
    recurrence,
    qualityOfLife,
    followUp,
    prognosis,
    isSelected,
    isCompleted
  } = data

  const getPrognosisColor = (prognosis?: string) => {
    if (!prognosis) return 'bg-gray-100 text-gray-800 border-gray-200'

    const prog = prognosis.toLowerCase()
    if (prog.includes('excellent') || prog.includes('good')) {
      return 'bg-green-100 text-green-800 border-green-200'
    }
    if (prog.includes('fair') || prog.includes('moderate')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    if (prog.includes('poor') || prog.includes('guarded')) {
      return 'bg-red-100 text-red-800 border-red-200'
    }
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${selected || isSelected
          ? 'border-gray-500 shadow-lg ring-2 ring-gray-500/20'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
        ${isCompleted ? 'bg-gray-50/50' : 'bg-card'}
        min-w-[220px] max-w-[300px]
      `}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-500 border-2 border-background"
      />

      {/* Node content */}
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-gray-600" />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {label}
          </h3>
        </div>

        {/* Prognosis badge */}
        {prognosis && (
          <Badge className={`text-xs ${getPrognosisColor(prognosis)}`}>
            {prognosis}
          </Badge>
        )}

        {/* Survival rate */}
        {survival && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              Survival Rates
            </div>
            <div className="text-xs text-foreground bg-green-50 p-2 rounded border">
              {survival}
            </div>
          </div>
        )}

        {/* Recurrence risk */}
        {recurrence && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Recurrence Risk
            </div>
            <div className="text-xs text-foreground bg-orange-50 p-2 rounded border">
              {recurrence}
            </div>
          </div>
        )}

        {/* Quality of life */}
        {qualityOfLife && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Quality of Life
            </div>
            <div className="text-xs text-foreground bg-blue-50 p-2 rounded border">
              {qualityOfLife}
            </div>
          </div>
        )}

        {/* Follow-up schedule */}
        {followUp && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Follow-up
            </div>
            <div className="text-xs text-foreground bg-purple-50 p-2 rounded border">
              {followUp}
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

export default OutcomeNode
