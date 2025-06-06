"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { worldImages } from './game-images'

interface GameWorldProps {
  level: number
}

export default function GameWorld({ level }: GameWorldProps) {
  // Different backgrounds for different levels using level images
  const getBackgroundImage = () => {
    // Use specific level images for each level
    switch (level) {
      case 1:
        return "/assets/level1.jpg"
      
      default:
        return "/assets/level1.jpg"
    }
  }

  // Get mid-layer and foreground layer images based on level
  const getMidLayerImage = () => {
    // Different mid-layer images for different level ranges
    if (level <= 3) {
      return "https://images.unsplash.com/photo-1600273970168-c3de7cc8ce44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    } else {
      return "https://images.unsplash.com/photo-1508596374429-f515218fc6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
  }
  
  // Visual effect properties based on level
  const getLevelEffects = () => {
    if (level <= 3) {
      return {
        overlayColor: "bg-black/20",
        groundColor: "from-green-800 to-green-700",
        ambientLight: "0.9",
      }
    } else {
      return {
        overlayColor: "bg-red-950/30",
        groundColor: "from-stone-900 to-red-950",
        ambientLight: "0.5",
      }
    }
  }

  const effects = getLevelEffects()
  const [parallaxOffset, setParallaxOffset] = useState(0)
  
  // Create parallax effect for game world
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20
      setParallaxOffset(moveX)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Far background layer - static */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${effects.overlayColor} z-10`}></div> {/* Overlay to darken and maintain consistent look */}
        <Image 
          src={getBackgroundImage()}
          alt={`Level ${level} Background`}
          fill
          style={{ objectFit: 'cover', opacity: effects.ambientLight }}
          priority
          quality={100}
          sizes="100vw"
          className="bg-no-repeat bg-center bg-cover"
          unoptimized
        />
      </div>
      
      {/* Mid background layer with parallax */}
      <div 
        className="absolute inset-0 z-1 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${parallaxOffset}px)` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
          <Image
            src={getMidLayerImage()}
            alt="Jungle Mid Layer"
            fill
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'bottom',
              opacity: 0.7
            }}
            quality={90}
            sizes="100vw"
          />
        </div>
      </div>
      
      {/* Foreground layer with stronger parallax */}
      <div 
        className="absolute inset-0 z-2 pointer-events-none transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${parallaxOffset * 2}px)` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className={`w-full h-full bg-gradient-to-t ${effects.groundColor}/80 to-transparent`}></div>
        </div>
      </div>
      
      {/* Ground/platform */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${effects.groundColor} z-3`} />
      
      {/* Level display text */}
      <div className="absolute bottom-8 left-8 text-white/90 text-sm font-semibold z-10 bg-black/40 px-3 py-1.5 rounded-md shadow-sm">
        Level {level}: {level <= 3 ? "Jungle Basics" : level <= 6 ? "Jungle Mid Level" : level <= 9 ? "Deep Jungle" : level <= 12 ? "Ancient Ruins" : "Dragon's Lair"}
      </div>
    </>
  )
} 