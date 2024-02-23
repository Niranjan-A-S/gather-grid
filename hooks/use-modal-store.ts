import { IModalStore } from '@/types';
import { create } from 'zustand';

export const useModalStore = create<IModalStore>((set) => ({
    isOpen: false,
    onOpen: (type) => set({ type, isOpen: true }),
    onClose: () => set({ isOpen: false, type: null }),
    type: null
}));
