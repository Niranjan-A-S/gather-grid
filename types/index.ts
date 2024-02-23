import { Member, Profile, Server } from '@prisma/client';

export type Members = (Member & { profile: Profile })

export type ServerWithMembersAndProfiles = Server & {
    members: Members[];
}

export type ModalType = 'CREATE_SERVER' | 'INVITE_PEOPLE' | 'EDIT_SERVER' | 'MANAGE_MEMBERS';
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
