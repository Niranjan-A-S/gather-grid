import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ServerIdPage = async ({ params: { serverId } }: { params: { serverId: string } }) => {

    const profile = await getCurrentProfile();
    if (!profile) return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: 'general'
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    const initialChannel = server?.channels[0];
    if (initialChannel?.name !== 'general') return null;

    return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
