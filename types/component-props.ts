import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { ReactNode } from 'react';
import { ServerWithMembersAndProfiles, _Member } from '.';

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
