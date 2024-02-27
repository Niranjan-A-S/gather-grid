import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidV4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        const { name, type } = await req.json();
        if (!type || !name) return new NextResponse('Empty Payload', { status: 422 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

        if (name === 'general') return new NextResponse('Name cannot be \'general\'', { status: 400 });

        const id = uuidV4();
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        id,
                        type
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('CHANNELS_ POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
