import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Medication } from '../../types'
import { Badge } from '../ui/Badge'
import { Clock, AlertTriangle, Pill, Calendar } from 'lucide-react'

interface MedicationNodeData {
  title: string
  medication: Medication
  isSelected?: boolean
  isCompleted?: boolean
  nextDose?: string
  hasInteractions?: boolean
  sideEffectsCount?: number
  metadata?: Record<string, any>
}

const MedicationNode: React.FC<NodeProps<MedicationNodeData>> = ({ data, selected }) => {
  const {
    title,
    medication,
    isSelected,
    isCompleted,
    nextDose,
    hasInteractions,
    sideEffectsCount
  } = data

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'twice daily': return 'bg-green-100 text-green-800 border-green-200'
      case 'three times daily': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'four times daily': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'weekly': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'as needed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatSchedule = (schedule: Medication['schedule']) => {
    const times = schedule.times.length
    const days = schedule.days.length

    if (times === 1 && days === 7) return 'Daily'
    if (times === 2 && days === 7) return 'Twice Daily'
    if (times === 3 && days === 7) return 'Three Times Daily'
    if (times === 4 && days === 7) return 'Four Times Daily'

    return `${times}x daily, ${days} days/week`
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
        ${hasInteractions ? 'ring-2 ring-red-200 ring-opacity-50' : ''}
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
          <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
            <Pill className="w-3 h-3 text-pink-600" />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {title || medication.name}
          </h3>
        </div>

        {/* Generic name */}
        <div className="text-xs text-muted-foreground">
          {medication.genericName}
        </div>

        {/* Dosage and frequency */}
        <div className="flex flex-wrap gap-1">
          <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-200">
            {medication.dosage}
          </Badge>
          <Badge className={`text-xs ${getFrequencyColor(medication.frequency)}`}>
            {medication.frequency}
          </Badge>
        </div>

        {/* Schedule */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Schedule:</span> {formatSchedule(medication.schedule)}
        </div>

        {/* Next dose */}
        {nextDose && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Next dose: {nextDose}
          </div>
        )}

        {/* Interactions warning */}
        {hasInteractions && (
          <div className="flex items-center space-x-1 text-xs text-red-600">
            <AlertTriangle className="w-3 h-3" />
            <span>Drug interactions</span>
          </div>
        )}

        {/* Side effects */}
        {sideEffectsCount !== undefined && sideEffectsCount > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Side effects:</span> {sideEffectsCount} reported
          </div>
        )}

        {/* Indication */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">For:</span> {medication.indication}
        </div>

        {/* Schedule times */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Times:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {medication.schedule.times.map((time, index) => (
              <span key={index} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                {time}
              </span>
            ))}
          </div>
        </div>

        {/* Start date */}
        <div className="text-xs text-muted-foreground flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Started {new Date(medication.schedule.startDate).toLocaleDateString()}
        </div>

        {/* Duration */}
        {medication.schedule.duration && (
          <div className="text-xs text-muted-foreground">
            Duration: {medication.schedule.duration} days
          </div>
        )}

        {/* Contraindications */}
        {medication.contraindications.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Contraindications:</span>
            <div className="mt-1">
              {medication.contraindications.slice(0, 2).map((contra, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                  {contra}
                </div>
              ))}
              {medication.contraindications.length > 2 && (
                <div className="text-muted-foreground">
                  +{medication.contraindications.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactions indicator */}
        {hasInteractions && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-2.5 h-2.5 text-white" />
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

export default MedicationNode
