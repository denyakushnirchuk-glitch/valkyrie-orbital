import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useMissions(filters = {}) {
  const [missions, setMissions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('missions')
        .select('*, programs(name), vehicles(name, type)')
        .order('created_at', { ascending: true })

      if (filters.agency)  query = query.eq('agency', filters.agency)
      if (filters.phase)   query = query.eq('phase', filters.phase)
      if (filters.outcome) query = query.eq('outcome', filters.outcome)
      if (filters.tag)     query = query.contains('tags', [filters.tag])

      const { data, error } = await query
      if (error) setError(error)
      else setMissions(data)
      setLoading(false)
    }
    fetch()
  }, [filters.agency, filters.phase, filters.outcome, filters.tag])

  return { missions, loading, error }
}