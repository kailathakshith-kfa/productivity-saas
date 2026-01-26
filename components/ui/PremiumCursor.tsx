'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PremiumCursor() {
    const pathname = usePathname()
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPointer, setIsPointer] = useState(false)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)

            // Check if hovering over clickable element
            const target = e.target as HTMLElement
            const clickable = (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                window.getComputedStyle(target).cursor === 'pointer'
            )
            setIsPointer(!!clickable)
        }

        window.addEventListener('mousemove', moveCursor)
        return () => window.removeEventListener('mousemove', moveCursor)
    }, [cursorX, cursorY])

    // MOVED: Conditional check AFTER hooks
    if (pathname?.startsWith('/dashboard')) return null

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Ambient Glow Follower */}
            <motion.div
                className="absolute left-0 top-0 h-96 w-96 rounded-full bg-brand-cyan/25 blur-[60px]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </div>
    )
}
