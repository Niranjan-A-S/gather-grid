import { Channel, ChannelType, Member, Profile, Server } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
};

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
    'DELETE_SERVER' |
    'DELETE_CHANNEL' |
    'EDIT_CHANNEL' |
    'MESSAGE_FILE'
    ;
export interface IModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>
}

export interface IModalStore {
    isOpen: boolean;
    data: IModalData;
    onClose(): void;
    type: ModalType | null;
    onOpen(type: ModalType, data?: IModalData): void;
}

export interface ISocketContext {
    socket: any | null;
    isConnected: boolean;
}
