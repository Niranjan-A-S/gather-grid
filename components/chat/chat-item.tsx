'use client';

import { cn } from '@/lib/utils';
import { IChatItemProps } from '@/types';
import { MemberRole } from '@prisma/client';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { FC, memo, useMemo, useState } from 'react';
import { ActionToolTip } from '../action-tooltip';
import { UserAvatar } from '../user/user-avatar';

const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    'ADMIN': <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
};

export const ChatItem: FC<IChatItemProps> = memo(({ content, currentMember, deleted, fileUrl, id, isUpdated, member, socketQuery, socketUrl, timestamp }) => {

    const [isEditing, setIsEditing] = useState(false);

    const isAdmin = useMemo(() => currentMember.role === MemberRole.ADMIN, [currentMember.role]);
    const isModerator = useMemo(() => currentMember.role === MemberRole.MODERATOR, [currentMember.role]);
    const isOwner = useMemo(() => currentMember.id === member.id, [currentMember.id, member.id]);

    const canDeleteMessage = useMemo(() => !deleted && (isAdmin || isModerator || isOwner), [deleted, isAdmin, isModerator, isOwner]);
    const canEditMessage = useMemo(() => !deleted && isOwner && !fileUrl, [deleted, fileUrl, isOwner]);

    const fileType = useMemo(() => fileUrl?.split('.').pop(), [fileUrl]);

    const isPDF = useMemo(() => fileType === 'pdf' && fileUrl, [fileType, fileUrl]);
    const isImage = useMemo(() => !isPDF && fileUrl, [fileUrl, isPDF]);

    console.log(fileUrl);

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
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
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionToolTip>
                    </div>
                )
            }
        </div >
    );
});