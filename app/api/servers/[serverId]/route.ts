import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PATCH = async (req: Request, { params: { serverId } }: { params: { serverId: string } }) => {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        if (!serverId) return new NextResponse('Server ID not found', { status: 400 });

        const { name, imageUrl } = await req.json();
        if (!imageUrl || !name) return new NextResponse('Empty Payload', { status: 422 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('[SERVER_ID PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function DELETE(req: Request, { params: { serverId } }: { params: { serverId: string } }) {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });
        const profileId = profile.id;

        if (!serverId) return new NextResponse('Server ID not found', { status: 400 });

        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('[SERVERS_ POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

