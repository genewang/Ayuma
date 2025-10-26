import React, { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { useRoadmaps } from '../hooks/useRoadmaps'
import { useAppStore } from '../stores/useAppStore'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Save, FolderOpen, Plus, Trash2 } from 'lucide-react'

interface RoadmapManagerProps {
  currentNodes: any[]
  currentEdges: any[]
}

export const RoadmapManager: React.FC<RoadmapManagerProps> = ({ currentNodes, currentEdges }) => {
  const [roadmapTitle, setRoadmapTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedRoadmaps, setSavedRoadmaps] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const { saveRoadmap, getRoadmaps } = useRoadmaps()
  const { setCurrentRoadmap } = useAppStore()

  useEffect(() => {
    if (user) {
      loadRoadmaps()
    }
  }, [user])

  const loadRoadmaps = async () => {
    if (!user) return

    setLoading(true)
    try {
      const roadmaps = await getRoadmaps()
      setSavedRoadmaps(roadmaps)
    } catch (error) {
      console.error('Failed to load roadmaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!roadmapTitle.trim() || !user) return

    setIsSaving(true)
    try {
      const roadmap = await saveRoadmap({
        title: roadmapTitle.trim(),
        description: `Career roadmap created on ${new Date().toLocaleDateString()}`,
        nodes: currentNodes,
        edges: currentEdges,
      })

      setRoadmapTitle('')
      await loadRoadmaps() // Refresh the list

      // Set as current roadmap
      setCurrentRoadmap({
        ...roadmap,
        nodes: JSON.parse(roadmap.nodes),
        edges: JSON.parse(roadmap.edges),
      })
    } catch (error) {
      console.error('Failed to save roadmap:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoad = async (roadmap: any) => {
    setCurrentRoadmap({
      ...roadmap,
      nodes: roadmap.nodes,
      edges: roadmap.edges,
    })
  }

  const handleDelete = async (id: string) => {
    try {
      // Note: deleteRoadmap would need to be implemented in the useRoadmaps hook
      await loadRoadmaps() // Refresh the list
    } catch (error) {
      console.error('Failed to delete roadmap:', error)
    }
  }

  if (!user) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Save Your Progress</CardTitle>
          <CardDescription>
            Sign in to save and load your career roadmaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="outline">
            Sign In to Save Roadmaps
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save current roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Save className="w-5 h-5 mr-2" />
            Save Current Roadmap
          </CardTitle>
          <CardDescription>
            Save your current career path configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="text"
            value={roadmapTitle}
            onChange={(e) => setRoadmapTitle(e.target.value)}
            placeholder="Enter roadmap title..."
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button
            onClick={handleSave}
            disabled={!roadmapTitle.trim() || isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Roadmap'}
          </Button>
        </CardContent>
      </Card>

      {/* Load saved roadmaps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Your Saved Roadmaps
          </CardTitle>
          <CardDescription>
            Load a previously saved career roadmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading roadmaps...</p>
            </div>
          ) : savedRoadmaps.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved roadmaps yet</p>
              <p className="text-xs mt-1">Create and save your first roadmap above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{roadmap.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(roadmap.updated_at).toLocaleDateString()}
                    </p>
                    {roadmap.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {roadmap.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoad(roadmap)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(roadmap.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
