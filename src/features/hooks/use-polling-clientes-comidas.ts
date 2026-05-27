import { useEffect } from 'react'
import { useClientesComidasStore } from '../store/clientes-comidas-store'

export function usePollingClientesComidas(interval: number = 5000) {
  const setClientes = useClientesComidasStore((s) => s.setClientes)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data/clientes-comidas')
        const data = await response.json()
        setClientes(data)
      } catch (err) {
        console.error('Error polling clientes-comidas:', err)
      }
    }

    fetchData()
    const timer = setInterval(fetchData, interval)
    return () => clearInterval(timer)
  }, [setClientes, interval])
}
