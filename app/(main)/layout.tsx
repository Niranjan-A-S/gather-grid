import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>This is a private route
            {children}
        </div>
    )
}
