import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { IServerSidebarProps } from '@/types/component-props';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { redirect } from 'next/navigation';
import { FC, memo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';

//todo move these mappers to some other files
const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
};

export const ServerSidebar: FC<IServerSidebarProps> = memo(async ({ serverId }) => {

    const profile = await getCurrentProfile();
    if (!profile) return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    });

    const textChannels = server?.channels.filter(({ type }) => type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter(({ type }) => type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter(({ type }) => type === ChannelType.VIDEO);
    const members = server?.members.filter(({ profileId }) => profileId !== profile.id);

    if (!server) return redirect('/');

    const role = server?.members.find(({ profileId }) => profileId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        // todo: move this data out of jsx
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: 'Members',
                                type: 'member',
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]}
                    />
                </div>
            </ScrollArea>
        </div>
    );
}
);
