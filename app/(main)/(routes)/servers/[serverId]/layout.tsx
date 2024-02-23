import { ServerSidebar } from '@/components/server/server-sidebar';
import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface IServerIdLayoutProps {
    children: ReactNode;
    params: { serverId: string }
}


const ServerIdLayout = async ({ children, params }: IServerIdLayoutProps) => {

    const profile = await getCurrentProfile();
    if (!profile) return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return !server
        ? redirect('/')
        : (
            <div className='h-full'>
                <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                    <ServerSidebar serverId={params.serverId} />
                </div>
                <main className='h-full md:pl-60'>
                    {children}
                </main>
            </div>
        );
};

export default ServerIdLayout;
