import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { IInviteCodePageProps } from '@/types/component-props';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const InviteCodePage: FC<IInviteCodePageProps> = async ({ params: { inviteCode } }) => {
    const profile = await getCurrentProfile();
    if (!profile) return redirectToSignIn();

    if (!inviteCode) return redirect('/');

    const existInServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existInServer) return redirect(`/servers/${existInServer.id}`);

    const server = await db.server.update({
        where: {
            inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    });

    if (server) return redirect(`/servers/${server.id}`);

    return null;
};

export default InviteCodePage;
