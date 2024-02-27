import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';
import { db } from './db';

export const getCurrentProfile = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);

    return !userId
        ? null
        : await db.profile.findUnique({
            where: {
                userId
            }
        });
};
