import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SmoothScrolling } from '@/components/ui/SmoothScrolling'
import { PremiumCursor } from '@/components/ui/PremiumCursor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Kinetic Flow AI',
    description: 'Clarity-first execution system for high performers',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SmoothScrolling>
                    <PremiumCursor />
                    {children}
                </SmoothScrolling>
            </body>
        </html>
    )
}
