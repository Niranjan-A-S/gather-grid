'use client';

import { IMediaRoomProps } from '@/types/component-props';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import qs from 'query-string';
import { FC, memo, useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

export const MediaRoom: FC<IMediaRoomProps> = memo(({ audio, chatId, video }) => {
    const { user } = useUser();
    const [token, setToken] = useState('');

    useEffect(() => {

        if (!user?.firstName || user?.lastName) return;

        const name = `${user?.firstName} ${user?.lastName}`;

        (async () => {
            try {
                const url = qs.stringifyUrl({
                    url: '/api/livekit',
                    query: {
                        username: name,
                        room: chatId
                    }
                });
                const data: any = await axios(url);
                setToken(data?.token);

            } catch (error) {
                console.log(error);
            }
        })();

    }, [chatId, user?.firstName, user?.lastName]);

    if (token === '') return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2
                className="h-7 w-7 text-zinc-500 animate-spin my-4"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Loading...
            </p>
        </div>
    );

    return (
        <LiveKitRoom
            token={token}
            audio={audio}
            video={video}
            connect={true}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
        >
            <VideoConference />
        </LiveKitRoom>
    );
});
