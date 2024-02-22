/* eslint-disable react/display-name */
"use client";
import { FC, ReactNode, memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface IActionToolTipProps {
    children: ReactNode;
    label: string;
    align: 'start' | 'center' | 'end';
    side: 'top' | 'right' | 'bottom' | 'left';
}

export const ActionToolTip: FC<IActionToolTipProps> = memo(({ align, children, label, side }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">
                        {label.toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
})