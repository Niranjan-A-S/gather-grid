'use client';

import { ISocketContext } from '@/types';
import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

const SocketContext = createContext<ISocketContext>({
    isConnected: false,
    socket: null
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: '/api/socket/io',
            addTrailingSlash: false
        });

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{ isConnected, socket }}>
        {children}
    </SocketContext.Provider>;
};
