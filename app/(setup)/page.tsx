import { getInitialProfile, getServer } from '@/lib/setup';
import { redirect } from 'next/navigation';

const SetupPage = async () => {

    const profile = await getInitialProfile();
    const server = await getServer(profile.id);

    return server
        ? redirect(`/servers/${server.id}`)
        : (
            <div>Create a Server</div>
        )
}

export default SetupPage