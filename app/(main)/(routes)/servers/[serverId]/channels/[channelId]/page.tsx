import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { MediaRoom } from '@/components/media-room';
import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
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

    const { name, serverId: _serverId, type: channelType } = channel;

    return (
        <div
            className="bg-white dark:bg-[#313338] flex flex-col h-full"
        >
            <ChatHeader
                name={name}
                serverId={_serverId}
                type="channel"
            />
            {
                channelType === ChannelType.TEXT && (
                    <>
                        < ChatMessages
                            name={channel.name}
                            member={member}
                            type="channel"
                            chatId={channel.id}
                            apiUrl="/api/messages"
                            socketUrl="/api/socket/messages"
                            socketQuery={{
                                serverId,
                                channelId
                            }}
                            paramKey="channelId"
                            paramValue={channel.id}
                        />
                        <ChatInput
                            apiUrl='/api/socket/messages'
                            name={name}
                            query={{ serverId, channelId }}
                            type='channel'
                        />
                    </>
                )
            }
            {
                channelType === ChannelType.AUDIO && (
                    <MediaRoom
                        audio={true}
                        video={false}
                        chatId={channelId}
                    />
                )
            }
            {
                channelType === ChannelType.VIDEO && (
                    <MediaRoom
                        audio={false}
                        video={true}
                        chatId={channelId}
                    />
                )
            }
        </div>
    );
}
