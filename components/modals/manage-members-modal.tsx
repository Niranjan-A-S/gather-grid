'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/hooks/use-modal-store';
import { Members, ServerWithMembersAndProfiles } from '@/types';
import React, { FC, useCallback, useMemo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { MemberItem } from '../user/member-item';

export const ManageMembersModal: FC = React.memo(() => {

    const { isOpen, onClose, type, data, onOpen } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'MANAGE_MEMBERS', [type, isOpen]);
    //NOTE: This is an escape hatch
    const { server } = data as { server: ServerWithMembersAndProfiles };

    const onRemove = useCallback(() => {
        //todo: remove member
    }, []);

    const renderServerMember = useCallback(({ id, profile: { imageUrl, name } }: Members) => (
        <MemberItem
            key={id}
            name={name}
            onRemove={onRemove}
            imageUrl={imageUrl}
        />
    ), [onRemove]);

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
                        {server?.members.length} member{server?.members.length > 1 ? 's' : ''}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map(renderServerMember)}
                </ScrollArea>
            </DialogContent>
        </Dialog >
    );
});
