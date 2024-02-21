import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';
import React from 'react'

const MainPage = () => {
    return (
        <div>
            <ModeToggle />
            <UserButton
                afterSignOutUrl='/'
            />
        </div>
    )
}

export default MainPage;
