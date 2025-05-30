import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Library Management System',
    description: 'Full-stack library management application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}