/* eslint-disable react/display-name */
"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/schema";

export const InitialModal: React.FC = React.memo(() => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    });
    const isLoading = useMemo(() => form.formState.isLoading, [form]);

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }, []);

    const renderFormItem = useCallback(({ field }: any) => (
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
                                    TODO Image Upload
                                </div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={renderFormItem}
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