import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { getCurrentProfile } from '@/lib';
import { getOrCreateNewConversation } from '@/lib/conversation';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

/* eslint-disable import/no-anonymous-default-export */
export default async function ({ params: { memberId, serverId } }: IMemberIdPageProps) {

    const profile = await getCurrentProfile();
    if (!profile) return redirectToSignIn();

    const currentMember = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId
        },
        include: {
            profile: true
        }
    });

    if (!currentMember) return redirect('/');

    const conversation = await getOrCreateNewConversation(currentMember.id, memberId);
    if (!conversation) return redirect(`/servers/${serverId}`);

    const { memberOne, memberTwo } = conversation;
    const { profile: { name, imageUrl } } = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return <div
        className="bg-white dark:bg-[#313338] flex flex-col h-full"
    >
        <ChatHeader
            name={name}
            serverId={serverId}
            type="conversation"
            imageUrl={imageUrl}
        />
        <ChatMessages
            apiUrl="/api/direct-messages"
            type="conversation"
            socketUrl="/api/socket/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            member={currentMember}
            name={name}
            chatId={conversation.id}
            socketQuery={{
                conversationId: conversation.id
            }}
        />
        <ChatInput
            apiUrl='/api/socket/direct-messages'
            name={name}
            query={{
                conversationId: conversation.id
            }}
            type="conversation"
        />
    </div>;
}
