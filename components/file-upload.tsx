'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { IFileUploadProps } from '@/types/component-props';
import '@uploadthing/react/styles.css';
import { X } from 'lucide-react';
import Image from 'next/image';
import { FC, memo, useMemo } from 'react';

export const FileUpload: FC<IFileUploadProps> = memo(({ endpoint, onChange, value }) => {
    const fileType: any = useMemo(() => value.split('.').pop, [value]);

    return (value && fileType !== 'pdf')
        ? (
            <div className="h-20 w-20 relative">
                <Image
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                    width={100}
                    height={100}
                />
                <button
                    className="absolute top-0 right-0 bg-rose-500 text-white shadow-sm p-1 rounded-full"
                    onClick={() => onChange('')}
                    type="button"

                >
                    <X className="h-3 w-4" />
                </button>
            </div>
        )
        : <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => onChange(res[0].url)}
            onUploadError={console.log}
        />;
});
