import { ChannelType } from '@prisma/client';
import * as z from 'zod';

export const createServerFormSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required.'
    }),
    imageUrl: z.string().min(1, {
        message: 'Server image is required.'
    })
});

export const createChannelFormSchema = z.object({
    name: z.string()
        .min(1, {
            message: 'Channel name is required.'
        })
        .refine(name => name !== 'general', {
            message: 'Channel name cannot be \'general\''
        }),
    type: z.nativeEnum(ChannelType)
});

export const chatInputFormSchema = z.object({
    content: z.string().min(1)
});

export const messageFileFormSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'Attachment is required.'
    })
});

export const editMessageInputFormSchema = z.object({
    content: z.string().min(1)
});
