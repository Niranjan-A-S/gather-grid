import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
    publicRoutes: ['/api/uploadthing'],
    debug: false//TODO: this can be removed later
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
