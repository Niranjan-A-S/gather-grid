'use client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/hooks/use-modal-store';
import axios from 'axios';
import qs from 'query-string';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '../ui/button';

export const DeleteMessageModal: React.FC = React.memo(() => {

    const { isOpen, onClose, type, data: { apiUrl, query } } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'DELETE_MESSAGE', [type, isOpen]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onConfirmDelete = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            });
            await axios.delete(url);
            onClose();
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, onClose, query]);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        The message will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-end w-full gap-4">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="destructive"
                            onClick={onConfirmDelete}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
});
