/* eslint-disable import/no-anonymous-default-export */
import { getCurrentProfile } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIO } from '@/types';
import { NextApiRequest } from 'next';

// eslint-disable-next-line complexity
export default async function (req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'PATCH' && req.method !== 'DELETE') return res.status(405).json({
        error: 'Method not allowed!'
    });

    try {
        const profile = await getCurrentProfile(req);
        if (!profile) return res.status(401).json({
            message: 'Unauthorized'
        });

        const { directMessageId, conversationId } = req.query;
        if (!conversationId) return res.status(400).json({
            message: 'Conversation ID missing'
        });
        if (!directMessageId) return res.status(400).json({
            message: 'Direct Message ID missing'
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

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversation.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!directMessage || directMessage.deleted) {
            return res.status(400).json({
                message: 'Message not found'
            });
        };

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === 'ADMIN';
        const isModerator = member.role === 'MODERATOR';
        const canModifyMessage = isAdmin || isModerator || isMessageOwner;

        if (!canModifyMessage) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        if (req.method === 'DELETE') {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string
                },
                data: {
                    deleted: true,
                    content: 'This message has been deleted.',
                    fileUrl: null
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        if (req.method === 'PATCH') {
            const { content } = req.body;
            if (!content) return res.status(422).json({
                message: 'Message Content is missing'
            });

            if (!isMessageOwner) {
                return res.status(401).json({
                    error: 'Unauthorized'
                });
            }
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string
                },
                data: {
                    content
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        const updateKey = `chat:${conversation.id}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);

    } catch (error) {
        console.log('[DIRECT_MESSAGE_ID]', error);
        return res.status(500).json({ message: 'Internal Error' });
    }

}
