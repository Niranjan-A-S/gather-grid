import { cn } from '@/lib/utils';
import { IUserAvatarProps } from '@/types/component-props';
import { FC, memo } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export const UserAvatar: FC<IUserAvatarProps> = memo(({ className, src }) => (
    <Avatar className={cn(
        'h-7 w-7 md:h-10 md:w-10',
        className
    )}>
        <AvatarImage src={src} />
    </Avatar>
));
