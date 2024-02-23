'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCopy } from '@/hooks/use-copy';
import { useModalStore } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export const InvitePeopleModal: React.FC = React.memo(() => {

    const { isOpen, onClose, type, data: { server }, onOpen } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'INVITE_PEOPLE', [type, isOpen]);

    const origin = useOrigin();
    const inviteCode = `${origin}/invite/${server?.inviteCode}`;

    const { isCopied, onCopy } = useCopy(inviteCode);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onGenerateCode = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`api/servers/${server?.id}/invite-code`);

            onOpen('INVITE_PEOPLE', { server: response.data });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }, [onOpen, server?.id]);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite People
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteCode}
                            disabled={isLoading}
                        />
                        <Button size="icon" onClick={onCopy} disabled={isLoading}>
                            {isCopied
                                ?
                                <Check className="w-4 h-4" />
                                :
                                <Copy className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                    <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                        disabled={isLoading}
                        onClick={onGenerateCode}
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    );
});
