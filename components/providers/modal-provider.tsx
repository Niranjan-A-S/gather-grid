'use client';

import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { CreateServerModal } from '@/components/modals/create-server-modal';
import { DeleteChannelModal } from '@/components/modals/delete-channel-modal';
import { DeleteSeverModal } from '@/components/modals/delete-server-modal';
import { EditChannelModal } from '@/components/modals/edit-channel-modal';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import { InvitePeopleModal } from '@/components/modals/invite-people-modal';
import { LeaveSeverModal } from '@/components/modals/leave-server-modal';
import { ManageMembersModal } from '@/components/modals/manage-members-modal';
import { MessageFileModal } from '@/components/modals/message-file-modal';
import { FC, memo, useEffect, useState } from 'react';

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
                <EditChannelModal />
                <MessageFileModal />
            </>
        )
        : null;
});
