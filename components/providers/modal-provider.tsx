'use client';

import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { CreateServerModal } from '@/components/modals/create-server-modal';
import { DeleteSeverModal } from '@/components/modals/delete-server-modal';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import { InvitePeopleModal } from '@/components/modals/invite-people-modal';
import { LeaveSeverModal } from '@/components/modals/leave-server-modal';
import { ManageMembersModal } from '@/components/modals/manage-members-modal';
import { FC, memo, useEffect, useState } from 'react';
import { DeleteChannelModal } from '../modals/delete-channel-modal';

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
                <LeaveSeverModal />
                <DeleteSeverModal />
                <DeleteChannelModal />
            </>
        )
        : null;
});
