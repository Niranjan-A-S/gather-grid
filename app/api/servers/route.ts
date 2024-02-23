import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidV4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        const { name, imageUrl } = await req.json();
        if (!imageUrl || !name) return new NextResponse('Empty Payload', { status: 422 });

        const inviteCode = uuidV4();
        const profileId = profile.id;

        const server = await db.server.create({
            data: {
                imageUrl,
                inviteCode,
                name,
                profileId,
                channels: {
                    create: [
                        { name: 'general', profileId }
                    ]
                },
                members: {
                    create: [
                        { role: MemberRole.ADMIN, profileId }
                    ]
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('[SERVERS_ POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }

}
