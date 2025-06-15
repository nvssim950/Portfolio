// FloatingParticles.tsx
'use client'

import { useEffect, useState } from 'react'

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export function FloatingParticles({ count = 20, className = '' }) {
  const [particles, setParticles] = useState<ParticleStyle[]>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }))
    setParticles(generated)
  }, [count])

  return (
    <>
      {particles.map((style, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full opacity-30 animate-pulse ${className}`}
          style={style}
        />
      ))}
    </>
  )
}
