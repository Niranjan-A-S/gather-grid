import { getCurrentProfile } from '@/lib';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const profile = await getCurrentProfile();
    if (profile) return redirect('/');

    return (
        <div className="h-full flex justify-center place-items-center">
            {children}
        </div>
    );
}
