'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'

export function Scroll3D({ children, className }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "0.5 0.5"] // Start when top enters viewport, end when center reaches center
    })

    // 3D Effect: Start tilted back and smaller, then straighten and scale up
    const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
    const y = useTransform(scrollYProgress, [0, 1], [50, 0])

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX,
                scale,
                opacity,
                y,
                perspective: 1000
            }}
            className={clsx("transform-gpu will-change-transform", className)}
        >
            {children}
        </motion.div>
    )
}
