import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Badge } from '../ui/Badge'
import { GitBranch, HelpCircle } from 'lucide-react'

interface DecisionNodeData {
  label: string
  question: string
  options?: string[]
  criteria?: string[]
  isSelected?: boolean
  isCompleted?: boolean
  metadata?: Record<string, any>
}

const DecisionNode: React.FC<NodeProps<DecisionNodeData>> = ({ data, selected }) => {
  const {
    label,
    question,
    options = [],
    criteria = [],
    isSelected,
    isCompleted
  } = data

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${selected || isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20'
          : 'border-blue-200 hover:border-blue-300 hover:shadow-md'
        }
        ${isCompleted ? 'bg-blue-50/50' : 'bg-card'}
        min-w-[200px] max-w-[280px]
      `}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />

      {/* Node content */}
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <GitBranch className="w-3 h-3 text-blue-600" />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {label}
          </h3>
        </div>

        {/* Question */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground flex items-center">
            <HelpCircle className="w-3 h-3 mr-1" />
            Decision Point
          </div>
          <p className="text-xs text-foreground bg-blue-50 p-2 rounded border">
            {question}
          </p>
        </div>

        {/* Options */}
        {options.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Options:
            </div>
            <div className="flex flex-wrap gap-1">
              {options.map((option, index) => (
                <Badge
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Criteria */}
        {criteria.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Criteria:
            </div>
            <div className="space-y-1">
              {criteria.map((criterion, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground bg-gray-50 p-1 rounded"
                >
                  • {criterion}
                </div>
              ))}
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

export default DecisionNode
