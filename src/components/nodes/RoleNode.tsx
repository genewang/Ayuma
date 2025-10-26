import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { RoleNode } from '../../types'
import { Badge } from '../ui/Badge'

const RoleNodeComponent: React.FC<NodeProps<RoleNode['data']>> = ({ data, selected }) => {
  const { role, isSelected, isCompleted } = data

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
      case 'Frontend': return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      case 'Backend': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Management': return 'bg-violet-50 text-violet-700 border-violet-200'
      case 'Executive': return 'bg-amber-50 text-amber-700 border-amber-200'
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
        min-w-[200px] max-w-[280px]
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

      {/* Role content */}
      <div className="space-y-2">
        {/* Category badge */}
        <Badge className={`text-xs ${getCategoryColor(role.category)}`}>
          {role.category}
        </Badge>

        {/* Role title */}
        <h3 className="font-semibold text-sm text-foreground leading-tight">
          {role.title}
        </h3>

        {/* Level badge */}
        <Badge className={`text-xs ${getLevelColor(role.level)}`}>
          {role.level.charAt(0).toUpperCase() + role.level.slice(1)}
        </Badge>

        {/* Salary range */}
        <div className="text-xs text-muted-foreground">
          ${role.salaryRange.min.toLocaleString()} - ${role.salaryRange.max.toLocaleString()}
        </div>

        {/* Description preview */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {role.description}
        </p>

        {/* Skills count */}
        <div className="text-xs text-muted-foreground">
          {role.skills.length} skills required
        </div>

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

export default RoleNodeComponent
