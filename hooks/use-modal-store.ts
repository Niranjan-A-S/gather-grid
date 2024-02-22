import { create } from 'zustand';

type ModalType = 'createServer'

interface IModalStore {
    isOpen: boolean;
    onClose(): void;
    type: ModalType | null;
    onOpen(type: ModalType): void;
}

export const useModalStore = create<IModalStore>((set) => ({
    isOpen: false,
    onOpen: (type) => set({ type, isOpen: true }),
    onClose: () => set({ isOpen: false, type: null }),
    type: null
}));
