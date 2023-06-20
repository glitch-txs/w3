import { create } from 'zustand'

interface ModalStore {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useModalStore = create<ModalStore>()((set) => ({
  open: false,
  setOpen: (open) => set((state) => ({ open })),
}))

export const openModal = ()=> useModalStore.getState().setOpen(true)