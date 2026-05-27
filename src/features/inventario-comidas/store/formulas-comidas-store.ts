import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FormulaComida } from '../types'

export function nextFormulaComidaConsecutivo(formulas: FormulaComida[]): string {
  if (formulas.length === 0) return 'REC-00001'
  const lastFormula = formulas[formulas.length - 1]
  const lastNum = parseInt(lastFormula.consecutivo.split('-')[1], 10)
  return `REC-${String(lastNum + 1).padStart(5, '0')}`
}

interface FormulasComidasState {
  formulas: FormulaComida[]
  addFormulaComida: (f: FormulaComida) => void
  updateFormulaComida: (id: string, f: Partial<FormulaComida>) => void
  deleteFormulaComida: (id: string) => void
  setFormulasComidas: (fs: FormulaComida[]) => void
}

export const useFormulasComidasStore = create<FormulasComidasState>()(
  persist(
    (set) => ({
      formulas: [],

      addFormulaComida: (f: FormulaComida) =>
        set((s) => ({ formulas: [...s.formulas, f] })),

      updateFormulaComida: (id: string, f: Partial<FormulaComida>) =>
        set((s) => ({
          formulas: s.formulas.map((r) =>
            r.id === id ? { ...r, ...f } : r
          ),
        })),

      deleteFormulaComida: (id: string) =>
        set((s) => ({
          formulas: s.formulas.filter((r) => r.id !== id),
        })),

      setFormulasComidas: (fs: FormulaComida[]) =>
        set(() => ({
          formulas: fs,
        })),
    }),
    {
      name: 'formulas-comidas-storage',
    }
  )
)
