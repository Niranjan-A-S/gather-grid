'use client';

import { FC, memo, useEffect, useState } from 'react';
import { CreateServerModal } from '@/components/modals/create-server-modal';
import { InvitePeopleModal } from '@/components/modals/invite-people-modal';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import { ManageMembersModal } from '@/components/modals/manage-members-modal';
import { CreateChannelModal } from '@/components/modals/create-channel-modal';

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
                <InvitePeopleModal />
                <EditServerModal />
                <ManageMembersModal />
                <CreateChannelModal />
            </>
        )
        : null;
});
