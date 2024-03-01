import { useHydrationHelper } from './use-hydration-helper';

export const useOrigin = () => {
    const { isMounted } = useHydrationHelper();

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    return isMounted
        ? origin
        : '';
};
