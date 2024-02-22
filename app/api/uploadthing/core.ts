/* eslint-disable no-empty-function */
import { auth } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleUserAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    return { userId };
};

export const ourFileRouter = {
    serverImage: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 }
    })
        .middleware(handleUserAuth)
        .onUploadComplete(() => { }),
    messageFile: f(['image', 'pdf'])
        .middleware(handleUserAuth)
        .onUploadComplete(() => { })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
