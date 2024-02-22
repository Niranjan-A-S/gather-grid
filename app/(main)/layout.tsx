import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';
import React, { FC, ReactNode } from 'react';

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    );

export default MainLayout;
