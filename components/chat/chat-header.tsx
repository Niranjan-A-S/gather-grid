'use client';

import { IChatHeaderProps } from '@/types/component-props';
import { Hash, Menu } from 'lucide-react';
import { FC, memo } from 'react';

export const ChatHeader: FC<IChatHeaderProps> = memo(({ type, name }) => {
    console.log(type);
    return <div
        className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2"
    >
        <Menu />
        {type === 'channel' && (
            <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        )}
        <p className="font-semibold text-md text-black dark:text-white">
            {name}
        </p>
    </div>;
});
