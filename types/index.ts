import { Channel, ChannelType, Member, Message, Profile, Server } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { IChatMessagesProps } from './component-props';
import { RefObject } from 'react';

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
    'MESSAGE_FILE' |
    'DELETE_MESSAGE';

export interface IModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
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

export interface IChatQueryOptions extends Pick<IChatMessagesProps, 'apiUrl' | 'paramKey' | 'paramValue'> {
    queryKey: string;
};

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export interface IChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    currentMember: Member;
    timestamp: string;
    fileUrl: Message['fileUrl'];
    isUpdated: boolean;
    deleted: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

export interface IChatScrollProps {
    chatRef: RefObject<HTMLDivElement>;
    bottomRef: RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore(): void;
    count: number;
};
