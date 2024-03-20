'use client';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useHydrationHelper } from '@/hooks/use-hydration-helper';
import { createServerFormSchema } from '@/lib/schema';
import { SignOutButton } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const InitialModal: React.FC = React.memo(() => {
    const { isMounted } = useHydrationHelper();
    const { refresh } = useRouter();

    const form = useForm({
        resolver: zodResolver(createServerFormSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    });
    const isLoading: boolean = useMemo(() => form.formState.isLoading, [form]);

    const onSubmit = useCallback(async (values: z.infer<typeof createServerFormSchema>) => {
        try {
            await axios.post('/api/servers', values);

            form.reset();
            refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }, [form, refresh]);

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

    return !isMounted
        ? null
        : (
            <Dialog open>
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
                                <SignOutButton >
                                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium px-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 bg-red-500 cursor-pointer">
                                        Sign out
                                    </div>
                                </SignOutButton>
                                <Button disabled={isLoading} variant="primary">Create</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog >
        );
});
