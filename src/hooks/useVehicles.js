import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setVehicles(data || [])
        setLoading(false)
      })
  }, [])

  return { vehicles, loading }
}