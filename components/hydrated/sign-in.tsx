'use client';

import { useHydrationHelper } from '@/hooks/use-hydration-helper';
import { SignIn as ClerkSignIn } from '@clerk/nextjs';

export const SignIn = () => {
    const { isMounted } = useHydrationHelper();
    return isMounted
        ? <ClerkSignIn />
        : null;
};

