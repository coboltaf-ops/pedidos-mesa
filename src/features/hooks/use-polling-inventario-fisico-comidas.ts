import { useEffect } from 'react'
import { useInventarioFisicoComidasStore } from '../store/inventario-fisico-comidas-store'

export function usePollingInventarioFisicoComidas(intervalMs: number = 5000) {
  const setInventariosFisicos = useInventarioFisicoComidasStore((s) => s.setInventariosFisicos)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/inventario-fisico-comidas')
        if (res.ok) {
          const data = await res.json()
          setInventariosFisicos(data)
        }
      } catch (err) {
        console.error('Error polling inventario-fisico-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setInventariosFisicos, intervalMs])
}
