'use client';

import { useChatQuery } from '@/hooks/use-chat-query';
import { MessageWithMemberWithProfile } from '@/types';
import { IChatMessagesProps } from '@/types/component-props';
import { format } from 'date-fns';
import { Loader2, ServerCrash } from 'lucide-react';
import { FC, Fragment, useMemo } from 'react';
import { ChatItem } from './chat-item';
import { ChatWelcome } from './chat-welcome';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

export const ChatMessages: FC<IChatMessagesProps> = (({
    apiUrl,
    chatId,
    member,
    name,
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
    type
}) => {

    const queryKey = useMemo(() => `chat:${chatId}`, [chatId]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });

    if (status === 'pending') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        );
    }

    return (
        <div className=" flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group?.items?.map(({ content, createdAt, updatedAt, id, deleted, fileUrl, member: messageMember }: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={id}
                                id={id}
                                content={content}
                                member={messageMember}
                                currentMember={member}
                                timestamp={format(new Date(createdAt), DATE_FORMAT)}
                                fileUrl={fileUrl}
                                isUpdated={createdAt !== updatedAt}
                                deleted={deleted}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
});
