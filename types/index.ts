import { Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersAndProfiles = Server & {
    members: (Member & { profile: Profile })[];
}

export type ModalType = 'CREATE_SERVER' | 'INVITE PEOPLE';
export interface IModalData {
    server?: Server;
}

export interface IModalStore {
    isOpen: boolean;
    data: IModalData;
    onClose(): void;
    type: ModalType | null;
    onOpen(type: ModalType, data?: IModalData): void;
}

