'use client';

import { ActionToolTip } from '@/components/action-tooltip';
import {
    Form, FormControl, FormField, FormItem
} from '@/components/ui/form';
import { UserAvatar } from '@/components/user/user-avatar';
import { useModalStore } from '@/hooks/use-modal-store';
import { editMessageInputFormSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { IChatItemProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import queryString from 'query-string';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    'ADMIN': <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
};

export const ChatItem: FC<IChatItemProps> = memo(({ content, currentMember, deleted, fileUrl, id, isUpdated, member, socketQuery, socketUrl, timestamp }) => {

    const { onOpen } = useModalStore();
    const router = useRouter();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    const isAdmin = useMemo(() => currentMember.role === MemberRole.ADMIN, [currentMember.role]);
    const isModerator = useMemo(() => currentMember.role === MemberRole.MODERATOR, [currentMember.role]);
    const isOwner = useMemo(() => currentMember.id === member.id, [currentMember.id, member.id]);

    const canDeleteMessage = useMemo(() => !deleted && (isAdmin || isModerator || isOwner), [deleted, isAdmin, isModerator, isOwner]);
    const canEditMessage = useMemo(() => !deleted && isOwner && !fileUrl, [deleted, fileUrl, isOwner]);

    const fileType = useMemo(() => fileUrl?.split('.').pop(), [fileUrl]);

    const isPDF = useMemo(() => fileType === 'pdf' && fileUrl, [fileType, fileUrl]);
    const isImage = useMemo(() => !isPDF && fileUrl, [fileUrl, isPDF]);

    const form = useForm<z.infer<typeof editMessageInputFormSchema>>({
        resolver: zodResolver(editMessageInputFormSchema),
        defaultValues: {
            content
        }
    });

    const isLoading = useMemo(() => form.formState.isLoading, [form.formState.isLoading]);

    //todo understand this
    useEffect(() => {
        form.reset({
            content
        });
    }, [content, form]);

    const handleSubmit = useCallback(async (values: z.infer<typeof editMessageInputFormSchema>) => {
        try {
            const url = queryString.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }, [form, id, socketQuery, socketUrl]);

    const onMemberClick = useCallback(() => {
        if (member.id !== currentMember.id) {
            router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
        }
    }, [currentMember.id, member.id, params?.serverId, router]);

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div
                    onClick={onMemberClick}
                    className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p
                                onClick={onMemberClick}
                                className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionToolTip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionToolTip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {
                        isImage && (
                            <a
                                href={fileUrl as any}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                            >
                                <Image
                                    src={fileUrl as any}
                                    alt={content}
                                    fill
                                    className="object-cover"
                                />
                            </a>
                        )}
                    {
                        isPDF && (
                            // todo: make this a component
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                <a
                                    href={fileUrl as any}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                >
                                    PDF file
                                </a>
                            </div>
                        )}
                    {
                        !fileUrl && !isEditing && (
                            <p className={cn(
                                'text-sm text-zinc-600 dark:text-zinc-300',
                                deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
                            )}>
                                {content}
                                {
                                    isUpdated && !deleted && (
                                        <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                            (edited)
                                        </span>
                                    )
                                }
                            </p>
                        )}
                    {
                        !fileUrl && isEditing && (
                            <Form {...form}>
                                <form
                                    className="flex items-center w-full gap-x-2 pt-2"
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                >
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            disabled={isLoading}
                                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                            placeholder="Edited message"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={isLoading} size="sm" variant="primary">
                                        Save
                                    </Button>
                                </form>
                                <span className="text-[10px] mt-1 text-zinc-400">
                                    Press escape to cancel, enter to save
                                </span>
                            </Form>
                        )
                    }
                </div>
            </div>
            {
                canDeleteMessage && (
                    <div
                        className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm"
                    >
                        {
                            canEditMessage && (
                                <ActionToolTip label="Edit">
                                    <Edit
                                        onClick={() => setIsEditing(true)}
                                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                    />
                                </ActionToolTip>
                            )}
                        <ActionToolTip label="Delete">
                            <Trash
                                onClick={() => onOpen('DELETE_MESSAGE', {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery
                                })}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionToolTip>
                    </div>
                )
            }
        </div >
    );
});
