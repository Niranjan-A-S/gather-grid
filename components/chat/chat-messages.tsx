'use client';

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { MessageWithMemberWithProfile } from '@/types';
import { IChatMessagesProps } from '@/types/component-props';
import { format } from 'date-fns';
import { ArrowDown, Loader2, ServerCrash } from 'lucide-react';
import { ElementRef, FC, Fragment, useCallback, useMemo, useRef } from 'react';
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
    const addKey = useMemo(() => `chat:${chatId}:messages`, [chatId]);
    const updateKey = useMemo(() => `chat:${chatId}:messages:update`, [chatId]);

    const chatRef = useRef<ElementRef<'div'>>(null);
    const bottomRef = useRef<ElementRef<'div'>>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });
    console.log(data);

    useChatSocket({ addKey, queryKey, updateKey });
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: (data?.pages?.[0] as any)?.items?.length ?? 0
    });

    const scrollToBottom = useCallback(() => {
        //todo check if really required to go down
        bottomRef?.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, []);

    if (status === 'loading') {
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
        <div className=" flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
            {!hasNextPage && (
                <>
                    <div className="flex-1" />
                    <ChatWelcome
                        type={type}
                        name={name}
                    />
                </>
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage
                        ? <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                        : <button
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                            onClick={() => fetchNextPage()}
                        >
                            Load Previous Messages
                        </button>
                    }
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group: any, i) => (
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
                <button
                    className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition absolute top-16 right-8'
                    onClick={scrollToBottom}
                >
                    <ArrowDown />
                </button>
            </div>
            <div ref={bottomRef} />
        </div>
    );
});
