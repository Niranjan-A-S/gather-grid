import { UserButton } from '@clerk/nextjs';
import React from 'react'

const MainPage = () => {
    return (
        <div>
            <UserButton
                afterSignOutUrl='/'
            />
        </div>
    )
}

export default MainPage;
