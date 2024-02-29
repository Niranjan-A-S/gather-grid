'use client';

import { IChatItemProps } from '@/types';
import { FC, memo, useMemo } from 'react';
import { UserAvatar } from '../user/user-avatar';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { ActionToolTip } from '../action-tooltip';
import { MemberRole } from '@prisma/client';

const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    'ADMIN': <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
};

export const ChatItem: FC<IChatItemProps> = memo(({ content, currentMember, deleted, fileUrl, id, isUpdated, member, socketQuery, socketUrl, timestamp }) => {

    const isAdmin = useMemo(() => currentMember.role === MemberRole.ADMIN, [currentMember.role]);
    const isModerator = useMemo(() => currentMember.role === MemberRole.MODERATOR, [currentMember.role]);
    const isOwner = useMemo(() => currentMember.id === member.id, [currentMember.id, member.id]);

    const canDeleteMessage = useMemo(() => !deleted && (isAdmin || isModerator || isOwner), [deleted, isAdmin, isModerator, isOwner]);
    const canEditMessage = useMemo(() => !deleted && isOwner && !fileUrl, [deleted, fileUrl, isOwner]);

    const fileType = useMemo(() => fileUrl?.split('.').pop(), [fileUrl]);

    const isPDF = useMemo(() => fileType === 'pdf' && fileUrl, [fileType, fileUrl]);
    const isImage = useMemo(() => !isPDF && fileUrl, [fileUrl, isPDF]);


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
                    {content}
                </div>
            </div>
        </div >
    );
});
