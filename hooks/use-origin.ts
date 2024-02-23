import { useEffect, useState } from 'react';

export const useOrigin = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted
        ? (typeof window !== 'undefined' && window.location.origin || '')
        : false;
};
