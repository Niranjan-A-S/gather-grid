import { useCallback, useState } from 'react';

export const useCopy = (value: string) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const onCopy = useCallback(() => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }, [value]);

    return { isCopied, onCopy };
};
