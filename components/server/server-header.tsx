'use client';

import { useModalStore } from '@/hooks/use-modal-store';
import { IServerHeaderProps } from '@/types/component-props';
import { MemberRole } from '@prisma/client';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { FC, useMemo } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

export const ServerHeader: FC<IServerHeaderProps> = ({ server, role }) => {

    const isAdmin = useMemo(() => role === MemberRole.ADMIN, [role]);
    const isModerator = useMemo(() => isAdmin || role === MemberRole.MODERATOR, [isAdmin, role]);

    const { onOpen } = useModalStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-white space-y-[2px] bg-white dark:bg-black"
            >
                {
                    isModerator
                        ? (
                            <DropdownMenuItem
                                className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                                onClick={() => onOpen('INVITE_PEOPLE', { server })}
                            >
                                Invite People
                                <UserPlus className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        )
                        : null
                }
                {
                    isAdmin
                        ? (
                            <DropdownMenuItem
                                className="px-3 py-2 text-sm cursor-pointer"
                                onClick={() => onOpen('EDIT_SERVER', { server })}

                            >
                                Server Settings
                                <Settings className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        )
                        : null
                }
                {
                    isAdmin
                        ? (
                            <DropdownMenuItem
                                className="px-3 py-2 text-sm cursor-pointer"
                                onClick={() => onOpen('MANAGE_MEMBERS', { server })}
                            >
                                Manage Members
                                <Users className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        )
                        : null
                }
                {
                    isModerator
                        ? (
                            <DropdownMenuItem
                                className="px-3 py-2 text-sm cursor-pointer"
                                onClick={() => onOpen('CREATE_CHANNEL')}
                            >
                                Create Channel
                                <PlusCircle className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        )
                        : null
                }
                {
                    isModerator
                        ? <DropdownMenuSeparator />
                        : null
                }
                {
                    isAdmin
                        ? (
                            <DropdownMenuItem
                                className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                                onClick={() => onOpen('DELETE_SERVER', { server })}
                            >
                                Delete Server
                                <Trash className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        )
                        : null
                }
                {
                    !isAdmin
                        ? (
                            <DropdownMenuItem
                                className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                                onClick={() => onOpen('LEAVE_SERVER', { server })}
                            >
                                Leave Server
                                <LogOut className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        )
                        : null
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
