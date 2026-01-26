'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect()
        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>
        </motion.div>
    )
}
