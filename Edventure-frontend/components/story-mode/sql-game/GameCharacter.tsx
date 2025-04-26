"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface GameCharacterProps {
  position: number
  health: number
}

export default function GameCharacter({ position, health }: GameCharacterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState('right')
  const [prevPosition, setPrevPosition] = useState(position)

  useEffect(() => {
    // Determine animation and direction when position changes
    if (position !== prevPosition) {
      setIsAnimating(true)
      setDirection(position > prevPosition ? 'right' : 'left')
      
      // Reset animation after a short time
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500)
      
      setPrevPosition(position)
      return () => clearTimeout(timer)
    }
  }, [position, prevPosition])

  // Choose character image based on animation state and health
  const getCharacterImage = () => {
    if (health < 30) {
      // Low health, show frustrated
      return '/sql-game/eduguide/eduguide-frustrated.png'
    }
    
    if (isAnimating) {
      // Moving, show ready for quest
      return '/sql-game/eduguide/eduguide-ready-for-quest.png'
    }
    
    // Default idle state
    return '/sql-game/eduguide/eduguide-ready-to-learn.jpeg.png'
  }

  return (
    <div 
      className={`absolute bottom-24 transition-all duration-300 ease-in-out ${direction === 'left' ? 'scale-x-[-1]' : ''}`}
      style={{ left: `${position}%` }}
    >
      <div className="relative w-32 h-36">
        <Image 
          src={getCharacterImage()}
          alt="Game Character"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
  )
} 