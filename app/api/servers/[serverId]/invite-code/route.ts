import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidV4 } from 'uuid';

export async function PATCH(_req: Request, { params: { serverId } }: { params: { serverId: string } }) {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        if (!serverId) return new NextResponse('Server ID not found', { status: 400 });

        const inviteCode = uuidV4();
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                inviteCode
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('[SERVER_ID_ PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
