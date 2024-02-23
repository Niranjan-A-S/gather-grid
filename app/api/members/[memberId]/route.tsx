import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PATCH = async (req: Request, { params: { memberId } }: { params: { memberId: string } }) => {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        const { role } = await req.json();
        if (!role) return new NextResponse('Empty Payload', { status: 422 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

        if (!memberId) return new NextResponse('Member ID missing', { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log('[MEMBER_ID_ PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const DELETE = async (req: Request, { params: { memberId } }: { params: { memberId: string } }) => {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) return new NextResponse('Server ID missing', { status: 400 });

        if (!memberId) return new NextResponse('Member ID missing', { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log('[MEMBER_ID_ DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

