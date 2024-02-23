import { Server, Profile, Member } from '@prisma/client';

export type ServerWithMembersAndProfiles = Server & {
    members: (Member & { profile: Profile })[];
}
