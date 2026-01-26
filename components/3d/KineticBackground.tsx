'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'

function AnimatedSphere() {
    const meshRef = useRef<any>(null)

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
                <MeshDistortMaterial
                    color="#6366f1" // Indigo
                    attach="material"
                    distort={0.4} // Strength of distortion
                    speed={1.5} // Speed of distortion
                    roughness={0.2}
                    metalness={0.9} // Metallic look
                />
            </Sphere>
        </Float>
    )
}

function AnimatedBlob() {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 64, 64]} scale={1.5}>
                <MeshDistortMaterial
                    color="#06b6d4" // Cyan
                    attach="material"
                    distort={0.6}
                    speed={2}
                    roughness={0.4}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
        </Float>
    )
}

export function KineticBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="purple" intensity={1} />

                {/* Sphere 1 - Top Right */}
                <group position={[3, 2, 0]}>
                    <AnimatedSphere />
                </group>

                {/* Sphere 2 - Bottom Left */}
                <group position={[-3, -2, -1]}>
                    <AnimatedBlob />
                </group>
            </Canvas>
        </div>
    )
}
