import { IChatScrollProps } from '@/types';
import { useEffect, useState } from 'react';

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count
}: IChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };

        topDiv?.addEventListener('scroll', handleScroll);

        return () => {
            topDiv?.removeEventListener('scroll', handleScroll);
        };
    }, [shouldLoadMore, loadMore, chatRef]);

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef.current;
        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 200;
        };

        let timeOutId: ReturnType<typeof setTimeout>;
        if (shouldAutoScroll()) {
            timeOutId = setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }

        return () => clearTimeout(timeOutId);
    }, [bottomRef, chatRef, count, hasInitialized]);
};
