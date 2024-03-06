'use client';

import { Video, VideoOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { FC, memo, useCallback, useMemo } from 'react';
import { ActionToolTip } from '../action-tooltip';

export const ChatVideoButton: FC = memo(() => {

    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const isVideo = useMemo(() => searchParams?.get('video'), [searchParams]);

    const Icon = useMemo(() => (isVideo ? VideoOff : Video), [isVideo]);
    const tooltipLabel = useMemo(() => (isVideo ? 'End video call' : 'Start video call'), [isVideo]);

    const onClick = useCallback(() => {
        const url = qs.stringifyUrl({
            url: pathname || '',
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true });

        router.push(url);
    }, [isVideo, pathname, router]);

    return (
        <ActionToolTip
            side="bottom"
            label={tooltipLabel}
        >
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionToolTip>
    );
});
