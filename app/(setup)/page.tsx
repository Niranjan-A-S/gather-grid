import { redirect } from 'next/navigation';
import { InitialModal } from '@/components/modals/initial-modal';
import { getInitialProfile, getServer } from '@/lib/setup';

const SetupPage = async () => {

    const profile = await getInitialProfile();
    const server = await getServer(profile.id);

    return server
        ? redirect(`/servers/${server.id}`)
        : <InitialModal />
}

export default SetupPage