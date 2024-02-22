'use client';

import { FC, memo, useEffect, useState } from 'react';
import { CreateServerModal } from '@/components/modals/create-server-modal';

export const ModalProvider: FC = memo(() => {
    const [isMounted, setIsMounted] = useState(false);

    // This is done to remove hydration vulnerabilities
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted
        ? (
            <>
                <CreateServerModal />
            </>
        )
        : null;
});
