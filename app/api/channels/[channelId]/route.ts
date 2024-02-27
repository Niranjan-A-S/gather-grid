import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params: { channelId } }: { params: { channelId: string } }) {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

        if (!channelId) return new NextResponse('Channel ID missing', { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            not: MemberRole.GUEST
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: 'general'
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('[CHANNEL_ID_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params: { channelId } }: { params: { channelId: string } }) {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        const { name, type } = await req.json();
        if (!type || !name) return new NextResponse('Empty Payload', { status: 422 });
        if (name === 'general') return new NextResponse('Name cannot be \'general\'', { status: 400 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

        if (!channelId) return new NextResponse('Channel ID missing', { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            not: MemberRole.GUEST
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            NOT: {
                                name: 'general'
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        //TODO: Remove this console.log  before production
        console.log('[CHANNEL_ID_UPDATE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

