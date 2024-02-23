import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IMemberItemProps } from '@/types/component-props';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { FC, memo } from 'react';
import { UserAvatar } from './user-avatar';

//todo move this to some other file
const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    'ADMIN': <ShieldAlert className="h-4 w-4 text-rose-500" />
};

export const MemberItem: FC<IMemberItemProps> = memo(({
    data: {
        profile: {
            name, imageUrl, email, id: memberProfileId
        },
        role,
        id: memberId
    },
    loadingId,
    serverProfileId,
    onRoleChange,
    onKick
}) => (
    <div className="flex items-center gap-x-2 mb-6">
        <UserAvatar className='' src={imageUrl} />
        <div className="flex flex-col gap-y-1">
            <div className="text-xs font-semibold flex items-center gap-x-1">
                {name}
                {roleIconMap[role]}
            </div>
            <p className="text-xs text-zinc-500">{email}</p>
        </div>
        {serverProfileId !== memberProfileId && loadingId !== memberId && (
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                                className="flex items-center"
                            >
                                <ShieldQuestion
                                    className="w-4 h-4 mr-2"
                                />
                                <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() => onRoleChange(memberId, 'GUEST')}
                                    >
                                        <Shield className="h-4 w-4 mr-2" />
                                        Guest
                                        {role === 'GUEST' && (
                                            <Check
                                                className="h-4 w-4 ml-auto"
                                            />
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onRoleChange(memberId, 'MODERATOR')}
                                    >
                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                        Moderator
                                        {role === 'MODERATOR' && (
                                            <Check
                                                className="h-4 w-4 ml-auto"
                                            />
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onKick(memberId)}
                        >
                            <Gavel className="h-4 w-4 mr-2" />
                            Kick
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )}
        {loadingId === memberId && (
            <Loader2
                className="animate-spin text-zinc-500 ml-auto w-4 h-4"
            />
        )}
    </div>
));
