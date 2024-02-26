import { Member, Profile, Server } from '@prisma/client';

export type _Member = (Member & { profile: Profile })

export type ServerWithMembersAndProfiles = Server & {
    members: _Member[];
}

export type ModalType =
    'CREATE_SERVER' |
    'INVITE_PEOPLE' |
    'EDIT_SERVER' |
    'MANAGE_MEMBERS' |
    'CREATE_CHANNEL' |
    'LEAVE_SERVER' |
    'DELETE_SERVER'
    ;
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
