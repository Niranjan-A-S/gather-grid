'use client';

import { IChatMessagesProps } from '@/types/component-props';
import { FC } from 'react';
import { ChatWelcome } from './chat-welcome';

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
    // eslint-disable-next-line arrow-body-style
}) => {
    return (
        <div className=" flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
        </div>
    );
});
