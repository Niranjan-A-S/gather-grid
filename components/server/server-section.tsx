'use client';

import { useModalStore } from '@/hooks/use-modal-store';
import { IServerSectionProps } from '@/types/component-props';
import { MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import { FC, memo } from 'react';
import { ActionToolTip } from '../action-tooltip';

export const ServerSection: FC<IServerSectionProps> = memo(({
    label,
    role,
    sectionType,
    server,
    channelType
}) => {
    const { onOpen } = useModalStore();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {
                role !== MemberRole.GUEST && sectionType === 'channels'
                    ? (
                        <ActionToolTip
                            label="Create Channel"
                            side="right"
                            align="center"
                        >
                            <button
                                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                onClick={() => onOpen('CREATE_CHANNEL', { channelType })}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </ActionToolTip>
                    )
                    : null
            }
            {
                role === MemberRole.ADMIN && sectionType === 'members'
                    ? (
                        <ActionToolTip
                            label="Manage Members"
                            side="right"
                            align="center"
                        >
                            <button
                                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                onClick={() => onOpen('MANAGE_MEMBERS', { server })}
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                        </ActionToolTip>
                    )
                    : null
            }
        </div>
    );
});
