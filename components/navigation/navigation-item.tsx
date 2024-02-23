'use client';

import { ActionToolTip } from '@/components/action-tooltip';
import { cn } from '@/lib/utils';
import { INavigationItemProps } from '@/types/component-props';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FC, memo, useCallback } from 'react';

export const NavigationItem: FC<INavigationItemProps> = memo(({ id, imageUrl, name }) => {

    const params = useParams();
    const router = useRouter();

    const onClick = useCallback(() => {
        router.push(`/servers/${id}`);
    }, [id, router]);

    return <ActionToolTip
        align='center'
        label={name}
        side='right'
    >
        <button
            onClick={onClick}
            className="group relative flex items-center"
        >
            <div className={cn(
                'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
                params?.serverId !== id && 'group-hover:h-[20px]',
                params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
            )} />
            <div className={cn(
                'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
                params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
            )}>
                <Image
                    fill
                    src={imageUrl}
                    alt="Channel"
                />
            </div>
        </button>
    </ActionToolTip>;
});
