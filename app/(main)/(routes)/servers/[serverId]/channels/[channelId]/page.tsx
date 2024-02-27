import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

/* eslint-disable import/no-anonymous-default-export */
export default async function ({ params: { channelId, serverId } }: IChannelIdPageProps) {

    const profile = await getCurrentProfile();
    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: channelId
        }
    });

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId
        }
    });

    if (!channel || !member) return redirect('/');

    const { name, serverId: _serverId } = channel;

    return (
        <div
            className="bg-white dark:bg-[#313338] flex flex-col h-full"
        >
            <ChatHeader
                name={name}
                serverId={_serverId}
                type="channel"
            />
            <div className="flex-1">Future Messages</div>
            <ChatInput
                apiUrl='/api/socket/messages'
                name={name}
                query={{ serverId, channelId }}
                type='channel'
            />
        </div>
    );
}
