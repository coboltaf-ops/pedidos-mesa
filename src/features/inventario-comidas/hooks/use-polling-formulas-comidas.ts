import { useEffect } from 'react'
import { useFormulasComidasStore } from '../store/formulas-comidas-store'
import type { FormulaComida } from '../types'

export function usePollingFormulasComidas(intervalMs: number = 5000) {
  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const response = await fetch('/api/data/formulas-comidas')
        if (!response.ok) throw new Error('Failed to fetch formulas-comidas')
        const data: FormulaComida[] = await response.json()
        useFormulasComidasStore.setState({ formulas: data })
      } catch (error) {
        console.error('Error polling formulas-comidas:', error)
      }
    }

    // Fetch immediately
    fetchFormulas()

    // Set up interval
    const interval = setInterval(fetchFormulas, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])
}
