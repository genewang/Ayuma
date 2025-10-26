import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Roadmap } from '../types'

export const useRoadmaps = () => {
  const { user } = useAuth()

  const saveRoadmap = async (roadmapData: Omit<Roadmap, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('roadmaps')
      .insert({
        ...roadmapData,
        user_id: user.id,
        nodes: JSON.stringify(roadmapData.nodes),
        edges: JSON.stringify(roadmapData.edges),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const getRoadmaps = async () => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return data.map(roadmap => ({
      ...roadmap,
      nodes: JSON.parse(roadmap.nodes),
      edges: JSON.parse(roadmap.edges),
    }))
  }

  const getRoadmap = async (id: string) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return {
      ...data,
      nodes: JSON.parse(data.nodes),
      edges: JSON.parse(data.edges),
    }
  }

  const updateRoadmap = async (id: string, updates: Partial<Roadmap>) => {
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('roadmaps')
      .update({
        ...updates,
        nodes: updates.nodes ? JSON.stringify(updates.nodes) : undefined,
        edges: updates.edges ? JSON.stringify(updates.edges) : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteRoadmap = async (id: string) => {
    if (!user) throw new Error('User must be authenticated')

    const { error } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  return {
    saveRoadmap,
    getRoadmaps,
    getRoadmap,
    updateRoadmap,
    deleteRoadmap,
  }
}
