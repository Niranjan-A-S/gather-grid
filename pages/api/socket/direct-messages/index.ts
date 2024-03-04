/* eslint-disable import/no-anonymous-default-export */
import { getCurrentProfile } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIO } from '@/types';
import { NextApiRequest } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'POST') return res.status(405).json({
        error: 'Method not allowed!'
    });

    try {
        const profile = await getCurrentProfile(req);
        if (!profile) return res.status(401).json({
            message: 'Unauthorized'
        });

        const { fileUrl, content } = req.body;
        if (!content) return res.status(422).json({
            message: 'Message Content is missing'
        });

        const { conversationId } = req.query;
        if (!conversationId) return res.status(400).json({
            message: 'Conversation ID missing'
        });

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!conversation) return res.status(400).json({
            message: 'Conversation not found'
        });

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
        if (!member) return res.status(400).json({
            message: 'Member not found'
        });

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversation.id,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log('[DIRECT_MESSAGES_POST]', error);
        return res.status(500).json({ message: 'Internal Error' });
    }

}
