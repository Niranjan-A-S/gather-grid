import { useSocket } from '@/components/providers/socket-provider';
import { IChatQueryOptions } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'query-string';

//todo understand this properly
export const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: IChatQueryOptions) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }: any) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue
            }
        }, { skipNull: true });

        const res = await fetch(url);
        return res.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000, //this is polling incase of failure of websocket
        //todo check this once
        initialPageParam: ''
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    };

};
