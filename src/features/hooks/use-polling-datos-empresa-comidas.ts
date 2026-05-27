import { useEffect } from 'react'
import { useDatosEmpresaComidasStore } from '../store/datos-empresa-comidas-store'

export function usePollingDatosEmpresaComidas(intervalMs: number = 5000) {
  const setDatosEmpresa = useDatosEmpresaComidasStore((s) => s.setDatosEmpresa)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/datos-empresa-comidas')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setDatosEmpresa(data[0])
          }
        }
      } catch (err) {
        console.error('Error polling datos-empresa-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setDatosEmpresa, intervalMs])
}
