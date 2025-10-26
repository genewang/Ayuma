import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useMedicationStore } from '../../stores/useMedicationStore'
import { useMedicalFlowStore } from '../../stores/useMedicalFlowStore'
import { Medication } from '../../types'
import { Pill, Clock, AlertTriangle, Plus, Calendar, Bell, CheckCircle, XCircle } from 'lucide-react'

const MedicationPanel: React.FC = () => {
  const {
    medications,
    activeAlerts,
    sideEffectLogs,
    getUpcomingDoses,
    loading
  } = useMedicationStore()
  const { setSelectedMedication } = useMedicalFlowStore()
  const [activeTab, setActiveTab] = useState<'current' | 'schedule' | 'alerts' | 'history'>('current')

  const tabs = [
    { id: 'current', name: 'Current Meds', icon: Pill },
    { id: 'schedule', name: 'Schedule', icon: Clock },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
    { id: 'history', name: 'History', icon: Calendar },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major': return 'bg-red-100 text-red-800 border-red-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

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

  const handleMedicationClick = (medication: Medication) => {
    setSelectedMedication(medication)
  }

  const upcomingDoses = getUpcomingDoses()

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading medications...</p>
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
              <Pill className="w-5 h-5 text-pink-600" />
              <h2 className="text-xl font-semibold">Medication Management</h2>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Track your medications, schedules, interactions, and side effects.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{medications.length}</div>
                <div className="text-xs text-muted-foreground">Active Meds</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{upcomingDoses.length}</div>
                <div className="text-xs text-muted-foreground">Upcoming Doses</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
                <div className="text-xs text-muted-foreground">Active Alerts</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{sideEffectLogs.length}</div>
                <div className="text-xs text-muted-foreground">Side Effects</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'current' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Medications</h3>

              {medications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No medications</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your current medications to track schedules and interactions.
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Medication
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {medications.map((medication) => (
                    <Card
                      key={medication.id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => handleMedicationClick(medication)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-base">
                              {medication.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {medication.genericName} • {medication.dosage}
                            </CardDescription>

                            <div className="flex flex-wrap gap-1">
                              <Badge className={`text-xs ${getFrequencyColor(medication.frequency)}`}>
                                {medication.frequency}
                              </Badge>
                              <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                                {medication.indication}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {activeAlerts.some(alert =>
                              alert.withDrug.toLowerCase().includes(medication.name.toLowerCase())
                            ) && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Schedule:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {medication.schedule.times.map((time, index) => (
                                <span key={index} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>
                            <div className="mt-1">
                              {medication.schedule.duration
                                ? `${medication.schedule.duration} days`
                                : 'Ongoing'
                              }
                            </div>
                          </div>
                        </div>

                        {medication.interactions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-xs text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{medication.interactions.length} interaction{medication.interactions.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medication Schedule</h3>

              <div className="space-y-3">
                {upcomingDoses.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No upcoming doses</h3>
                      <p className="text-muted-foreground">
                        Your next medication doses will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingDoses.map((dose, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Pill className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{dose.medication.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {dose.medication.dosage} • {dose.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Bell className="w-4 h-4 mr-1" />
                              Remind
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Taken
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Drug Interactions & Alerts</h3>

              {activeAlerts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active alerts</h3>
                    <p className="text-muted-foreground">
                      No drug interactions or alerts detected.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map((alert, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-red-800">
                                Drug Interaction
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {alert.description}
                              </div>
                              <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                                {alert.severity} risk
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-2">
                                <strong>Management:</strong> {alert.management}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Side Effects & History</h3>

              {sideEffectLogs.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No history recorded</h3>
                    <p className="text-muted-foreground">
                      Track side effects and medication history here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sideEffectLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              log.severity === 'severe' ? 'bg-red-500' :
                              log.severity === 'moderate' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                            <div>
                              <div className="font-medium">{log.sideEffect}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(log.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge className={`text-xs ${
                            log.severity === 'severe' ? 'bg-red-100 text-red-800 border-red-200' :
                            log.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {log.severity}
                          </Badge>
                        </div>
                        {log.notes && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {log.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MedicationPanel
