import { useEffect } from 'react'
import { useBodegasComidasStore } from '../store/bodegas-comidas-store'

export function usePollingBodegasComidas(intervalMs: number = 5000) {
  const setBodyegasComidas = useBodegasComidasStore((s) => s.setBodyegasComidas)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/bodegas-comidas')
        if (res.ok) {
          const data = await res.json()
          setBodyegasComidas(data)
        }
      } catch (err) {
        console.error('Error polling bodegas-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setBodyegasComidas, intervalMs])
}
