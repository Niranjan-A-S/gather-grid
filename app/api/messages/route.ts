import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGE_BATCH = 10;

//todo understand this properly
export const GET = async (req: Request) => {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return NextResponse.json('Unauthenticated', { status: 401 });

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const channelId = searchParams.get('channelId');

        if (!channelId) return NextResponse.json('Channel ID is missing', { status: 400 });

        let messages: Message[] = [];
        console.log({ channelId, cursor, profile });

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        console.log({ messages });

        let nextCursor = null;
        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1].id;
        }

        console.log({ nextCursor });

        return NextResponse.json({
            items: messages,
            nextCursor
        });

    } catch (error) {
        console.log('[MESSAGES_GET]', error);
        return NextResponse.json('Internal Error', {});
    }
};
