import { auth, currentUser, redirectToSignIn } from '@clerk/nextjs';
import { db } from './db';

export const getInitialProfile = async () => {
    const user = await currentUser();
    if (!user) return redirectToSignIn();

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });
    if (profile) return profile;

    const { firstName, lastName, username, emailAddresses: [{ emailAddress: email }], imageUrl, id: userId } = user;
    const name = (firstName && lastName) ? `${firstName} ${lastName}` : username || email;
    const newProfile = await db.profile.create({
        data: {
            userId,
            name,
            email,
            imageUrl
        }
    });

    return newProfile;
};

export const getServer = async (profileId: string) => await db.server.findFirst({
    where: {
        members: {
            some: {
                profileId
            }
        }
    }
});


export const getCurrentProfile = async () => {
    const { userId } = auth();

    return !userId
        ? null
        : await db.profile.findUnique({
            where: {
                userId
            }
        });
};
