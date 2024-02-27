'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/hooks/use-modal-store';
import { createChannelFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from '@prisma/client';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const EditChannelModal: React.FC = React.memo(() => {

    const { isOpen, onClose, type, data: { server, channel } } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'EDIT_CHANNEL', [type, isOpen]);

    const { refresh } = useRouter();

    const form = useForm({
        resolver: zodResolver(createChannelFormSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT
        }
    });

    useEffect(() => {
        if (channel) {
            const { type, name } = channel;
            form.setValue('type', type);
            form.setValue('name', name);
        }
    }, [channel, form]);

    const isLoading: boolean = useMemo(() => form.formState.isLoading, [form]);

    const onSubmit = useCallback(async (values: z.infer<typeof createChannelFormSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            });
            await axios.patch(url, values);
            form.reset();
            refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }, [channel?.id, form, onClose, refresh, server?.id]);

    const renderSelectItem = useCallback(({ field }: any) => (
        <FormItem>
            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Channel Type
            </FormLabel>
            <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
            >
                <FormControl>
                    <SelectTrigger
                        className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                    >
                        <SelectValue placeholder="Select a channel type" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {Object.values(ChannelType).map((type) => (
                        <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                        >
                            {type.toLowerCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    ), [isLoading]);

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
                        Edit Channel
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
                            <FormField
                                control={form.control}
                                name="type"
                                render={renderSelectItem}
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
