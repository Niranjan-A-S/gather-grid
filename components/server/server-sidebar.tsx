import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { FC, memo } from 'react';
import { ServerHeader } from './server-header';

interface IServerSidebarProps {
    serverId: string;
}

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
    const videChannels = server?.channels.filter(({ type }) => type === ChannelType.VIDEO);
    const members = server?.members.filter(({ profileId }) => profileId !== profile.id);

    if (!server) return redirect('/');

    const role = server?.members.find(({ profileId }) => profileId === profileId)?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader
                server={server}
                role={role}
            />
        </div>
    );
}
);
