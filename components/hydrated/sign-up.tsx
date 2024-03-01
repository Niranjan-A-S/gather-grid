'use client';

import { useHydrationHelper } from '@/hooks/use-hydration-helper';
import { SignUp as ClerkSignUp } from '@clerk/nextjs';

export const SignUp = () => {
    const { isMounted } = useHydrationHelper();
    return isMounted
        ? <ClerkSignUp />
        : null;
};

