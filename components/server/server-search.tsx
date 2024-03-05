'use client';

import { IServerSearchProps } from '@/types/component-props';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

export const ServerSearch: FC<IServerSearchProps> = memo(({
    data
}) => {
    //todo custom hook for all visibility hooks
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const router = useRouter();
    const params = useParams();

    //todo custom hook for shortcuts
    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(open => !open);
            }
        };

        document.addEventListener('keydown', keyDown);
        return () => document.removeEventListener('keydown', keyDown);
    }, []);

    const onClick = useCallback(({ id, type }: { id: string, type: 'member' | 'channel' }) => {
        router.push(`/servers/${params?.serverId}/${type === 'channel' ? 'channels' : 'conversations'}/${id}`);
    }, [params?.serverId, router]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p
                    className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
                >
                    Search
                </p>
                <kbd
                    className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
                >
                    <span className="text-xs">ctrl</span>K
                </kbd>
            </button>
            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <CommandInput
                    placeholder='Search all channels and members'
                />
                <CommandList>
                    <CommandEmpty>
                        No Results found!
                    </CommandEmpty>
                    {data.map(({ label, type, data }) => (
                        (!data?.length)
                            ? null
                            : (
                                <CommandGroup key={label} heading={label}>
                                    {data?.map(({ id, icon, name }) => (
                                        <CommandItem
                                            key={id}
                                            onSelect={() => onClick({ id, type })}
                                        >
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )))}
                </CommandList>
            </CommandDialog>
        </>
    );
});
