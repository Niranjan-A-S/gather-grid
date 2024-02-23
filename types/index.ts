import { Server, Profile, Member } from '@prisma/client';

export type ServerWithMembersAndProfiles = Server & {
    members: (Member & { profile: Profile })[];
}

type ModalType = 'CREATE_SERVER'
export interface IModalStore {
    isOpen: boolean;
    onClose(): void;
    type: ModalType | null;
    onOpen(type: ModalType): void;
}

