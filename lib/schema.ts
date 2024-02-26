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
    name: z.string().min(1, {
        message: 'Server name is required.'
    })
});
