'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/hooks/use-modal-store';
import { createChannelFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const CreateChannelModal: React.FC = React.memo(() => {

    const { isOpen, onClose, type } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'CREATE_CHANNEL', [type, isOpen]);

    const { refresh } = useRouter();

    const form = useForm({
        resolver: zodResolver(createChannelFormSchema),
        defaultValues: {
            name: ''
        }
    });
    const isLoading: boolean = useMemo(() => form.formState.isLoading, [form]);

    const onSubmit = useCallback(async (values: z.infer<typeof createChannelFormSchema>) => {
        try {
            await axios.post('/api/servers', values);
            form.reset();
            refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }, [form, onClose, refresh]);

    const renderInputItem = useCallback(({ field }: any) => (
        <FormItem>
            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Channel name
            </FormLabel>
            <FormControl>
                <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Enter channel name"
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    ), [isLoading]);

    const handleClose = useCallback(() => {
        form.reset();
        onClose();
    }, [form, onClose]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={renderInputItem}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
});
