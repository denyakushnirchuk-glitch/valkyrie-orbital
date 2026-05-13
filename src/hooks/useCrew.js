import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useCrew(agency) {
  const [crew,    setCrew]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = supabase
      .from('crew')
      .select('*')
      .order('created_at', { ascending: true })

    if (agency) query = query.eq('agency', agency)

    query.then(({ data }) => {
      setCrew(data || [])
      setLoading(false)
    })
  }, [agency])

  return { crew, loading, setCrew }
}