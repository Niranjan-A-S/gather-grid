'use client';

import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { FC, ReactNode, memo } from 'react';

//todo see if this is required to move to a state variable
const queryClient = new QueryClient();

export const QueryProvider: FC<{ children: ReactNode }> = memo(({ children }) => (
    <QueryClientProvider
        client={queryClient}
    >{
            children}
    </QueryClientProvider>
));
