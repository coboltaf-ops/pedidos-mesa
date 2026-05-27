import { create } from 'zustand'
import type { ClienteComida } from '../types'

interface ClientesComidasStore {
  clientes: ClienteComida[]
  setClientes: (clientes: ClienteComida[]) => void
  addCliente: (cliente: ClienteComida) => void
  updateCliente: (id: string, cliente: Partial<ClienteComida>) => void
  deleteCliente: (id: string) => void
}

export const useClientesComidasStore = create<ClientesComidasStore>((set) => ({
  clientes: [],
  setClientes: (clientes) => set({ clientes }),
  addCliente: (cliente) => set((state) => ({ clientes: [...state.clientes, cliente] })),
  updateCliente: (id, cliente) =>
    set((state) => ({
      clientes: state.clientes.map((c) => (c.id === id ? { ...c, ...cliente } : c)),
    })),
  deleteCliente: (id) =>
    set((state) => ({
      clientes: state.clientes.filter((c) => c.id !== id),
    })),
}))
