import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full flex justify-center place-items-center">
            {children}
        </div>
    )
}
