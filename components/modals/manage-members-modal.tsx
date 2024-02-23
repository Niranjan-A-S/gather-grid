'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/hooks/use-modal-store';
import { ServerWithMembersAndProfiles, _Member } from '@/types';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { MemberItem } from '../user/member-item';

export const ManageMembersModal: FC = React.memo(() => {

    const [loadingId, setLoadingId] = useState('');
    const router = useRouter();

    const { isOpen, onClose, type, data, onOpen } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'MANAGE_MEMBERS', [type, isOpen]);

    const { server } = data as { server: ServerWithMembersAndProfiles };

    const onKick = useCallback(async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });
            const response = await axios.delete(url);

            router.refresh();
            onOpen('MANAGE_MEMBERS', { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId('');
        }
    }, [onOpen, router, server?.id]);

    const onRoleChange = useCallback(async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });
            const response = await axios.patch(url, { role });

            router.refresh();
            onOpen('MANAGE_MEMBERS', { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId('');
        }
    }, [onOpen, router, server?.id]);

    const renderServerMember = useCallback((member: _Member) => (
        <MemberItem
            key={member.id}
            data={member}
            onRoleChange={onRoleChange}
            onKick={onKick}
            serverProfileId={server?.profileId}
            loadingId={loadingId}
        />
    ), [loadingId, onKick, onRoleChange, server?.profileId]);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription
                        className='text-center text-zinc-500'
                    >
                        {server?.members?.length} member{server?.members?.length > 1 ? 's' : ''}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map(renderServerMember)}
                </ScrollArea>
            </DialogContent>
        </Dialog >
    );
});
