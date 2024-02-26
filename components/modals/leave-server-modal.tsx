'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/hooks/use-modal-store';
import React, { useMemo, useState } from 'react';

export const LeaveSeverModal: React.FC = React.memo(() => {

    const { isOpen, onClose, type, data: { server }, onOpen } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'LEAVE_SERVER', [type, isOpen]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave Server
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    Leave Server
                </div>
            </DialogContent>
        </Dialog >
    );
});
