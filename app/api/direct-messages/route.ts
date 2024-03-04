import { getCurrentProfile } from '@/lib';
import { db } from '@/lib/db';
import { DirectMessage, Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGE_BATCH = 10;

//todo understand this properly
export const GET = async (req: Request) => {
    try {
        const profile = await getCurrentProfile();
        if (!profile) return NextResponse.json('Unauthenticated', { status: 401 });

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) return NextResponse.json('Conversation ID is missing', { status: 400 });

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
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
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                where: {
                    conversationId
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

        let nextCursor = null;
        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });

    } catch (error) {
        console.log('[DIRECT_MESSAGES_GET]', error);
        return NextResponse.json('Internal Error', {});
    }
};
