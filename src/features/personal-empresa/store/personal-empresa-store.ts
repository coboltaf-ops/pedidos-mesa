import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PersonalEmpresa = {
  id?: string
  nombre?: string
  [key: string]: any
}

interface PersonalEmpresaState {
  personal: PersonalEmpresa[]
  addPersonal: (p: PersonalEmpresa) => void
  updatePersonal: (id: string, p: Partial<PersonalEmpresa>) => void
  deletePersonal: (id: string) => void
}

export const usePersonalEmpresaStore = create<PersonalEmpresaState>()(
  persist(
    (set) => ({
      personal: [],
      addPersonal: (p) => set((s) => ({ personal: [...s.personal, p] })),
      updatePersonal: (id, p) =>
        set((s) => ({
          personal: s.personal.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      deletePersonal: (id) =>
        set((s) => ({ personal: s.personal.filter((x) => x.id !== id) })),
    }),
    { name: 'personal-empresa-storage' }
  )
)
