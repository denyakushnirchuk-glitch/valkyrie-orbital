import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useVehicles(agency) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: true })

    if (agency) query = query.eq('agency', agency)

    query.then(({ data }) => {
      setVehicles(data || [])
      setLoading(false)
    })
  }, [agency])

  return { vehicles, loading }
}