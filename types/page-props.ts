interface IServerIdPageProps extends Record<'params', IServerIdPage> {
};
interface IChannelIdPageProps extends Record<'params', IChannelIdPage> {
};
interface IMemberIdPageProps extends Record<'params', IMemberIdPage> {
};

interface IServerIdPage {
    serverId: string;
}

interface IChannelIdPage extends IServerIdPage {
    channelId: string;
};

interface IMemberIdPage extends IServerIdPage {
    memberId: string;
};
