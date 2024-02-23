'use client';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/hooks/use-modal-store';
import { formSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const EditServerModal: React.FC = React.memo(() => {

    const { isOpen, onClose, type, data: { server } } = useModalStore();
    const isModalOpen = useMemo(() => isOpen && type === 'EDIT_SERVER', [type, isOpen]);

    const { refresh } = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    });

    useEffect(() => {
        if (server) {
            form.setValue('name', server.name);
            form.setValue('imageUrl', server.imageUrl);
        }
    }, [form, server]);

    const isLoading: boolean = useMemo(() => form.formState.isLoading, [form]);

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset();
            refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }, [form, onClose, refresh, server?.id]);

    const renderInputItem = useCallback(({ field }: any) => (
        <FormItem>
            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Server name
            </FormLabel>
            <FormControl>
                <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Enter server name"
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    ), [isLoading]);

    const renderFileUploadItem = useCallback(({ field }: any) => (
        <FormItem>
            <FormControl>
                <FileUpload
                    endpoint="serverImage"
                    onChange={field.onChange}
                    value={field.value}
                />
            </FormControl>
        </FormItem>
    ), []);

    const handleClose = useCallback(() => {
        form.reset();
        onClose();
    }, [form, onClose]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={renderFileUploadItem}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={renderInputItem}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">Update</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
});
