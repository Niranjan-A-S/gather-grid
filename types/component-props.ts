import { Channel, ChannelType, Member, MemberRole, Profile, Server } from '@prisma/client';
import { ReactNode } from 'react';
import { ServerWithMembersAndProfiles, _Member } from '.';
import { StringValidation } from 'zod';

export interface IServerIdLayoutProps {
    children: ReactNode;
    params: { serverId: string }
}

export interface INavigationItemProps extends Pick<Server, 'id' | 'name' | 'imageUrl'> {
}

export interface IServerHeaderProps {
    server: ServerWithMembersAndProfiles;
    role?: MemberRole;
}

export interface IServerSidebarProps {
    serverId: string;
}

export interface IActionToolTipProps {
    children: ReactNode;
    label: string;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export interface IFileUploadProps {
    onChange(url: string): void;
    value: string;
    endpoint: 'serverImage' | 'messageFile'
}

export interface IInviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

export interface IUserAvatarProps {
    src?: string;
    className?: string;
}

export interface IMemberItemProps {
    data: _Member;
    onRoleChange(memberId: string, role: MemberRole): void;
    onKick(memberId: string): void;
    serverProfileId: string;
    loadingId: string;
}

interface IServerSearch {
    label: string;
    type: 'channel' | 'member',
    data: {
        icon: React.ReactNode;
        name: string;
        id: string;
    }[] | undefined
}

export interface IServerSearchProps {
    data: IServerSearch[]
}
export interface IServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: 'channels' | 'members';
    channelType?: ChannelType;
    server?: ServerWithMembersAndProfiles;
}

export interface IServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

export interface IServerMemberProps {
    server: Server;
    member: Member & {
        profile: Profile;
    };
}

export interface IChatHeaderProps {
    name: string;
    serverId: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}

export interface IMobileToggleProps extends Pick<IChatHeaderProps, 'serverId'> { }

export interface IChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    type: 'channel' | 'conversation';
    name: string;
}

export interface IEmojiPickerProps {
    onChange(value: string): void;
}
export interface IChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: 'channelId' | 'conversationId';
    paramValue: string;
    type: 'channel' | 'conversation'
}

export interface IChatWelcomeProps extends Pick<IChatMessagesProps, 'type' | 'name'> { };
