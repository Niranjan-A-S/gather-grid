'use client';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useModalStore } from '@/hooks/use-modal-store';
import { messageFileFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const MessageFileModal: React.FC = React.memo(() => {
    const { refresh } = useRouter();

    const { isOpen, type, onClose, data: { apiUrl, query } } = useModalStore();
    const isModalOpen = useMemo(() => type === 'MESSAGE_FILE' && isOpen, [isOpen, type]);

    const form = useForm({
        resolver: zodResolver(messageFileFormSchema),
        defaultValues: {
            fileUrl: ''
        }
    });
    const isLoading: boolean = useMemo(() => form.formState.isLoading, [form]);


    const handleClose = useCallback(() => {
        form.reset();
        onClose();
    }, [form, onClose]);

    const onSubmit = useCallback(async (values: z.infer<typeof messageFileFormSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            });
            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });

            form.reset();
            refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }, [apiUrl, form, handleClose, query, refresh]);

    const renderFileUploadItem = useCallback(({ field }: any) => (
        <FormItem>
            <FormControl>
                <FileUpload
                    endpoint="messageFile"
                    onChange={field.onChange}
                    value={field.value}
                />
            </FormControl>
        </FormItem>
    ), []);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6" >
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={renderFileUploadItem}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
});
