"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SQLMonsters } from './game-data'
import { useRouter } from 'next/navigation'
import { journeyImages, monsterImages, uiImages } from './game-images'
import { motion } from 'framer-motion'

interface JourneyMapProps {
  onStartGame: () => void
}

export default function JourneyMap({ onStartGame }: JourneyMapProps) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null)
  const [activeLevel, setActiveLevel] = useState<number | null>(null)
  const [showPathAnimation, setShowPathAnimation] = useState(false)
  const router = useRouter()

  // Play path drawing animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPathAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate positions for a more spread out treasure map style path
  const getMonsterPosition = (index: number, total: number) => {
    // Define key points on the treasure map path
    const pathPoints = [
      { x: 15, y: 75 },   // Starting point (bottom left)
      { x: 30, y: 35 },   // First stop (top left area)
      { x: 45, y: 60 },   // Second stop (mid left)
      { x: 55, y: 25 },   // Third stop (top mid)
      { x: 65, y: 70 },   // Fourth stop (bottom mid)
      { x: 75, y: 40 },   // Fifth stop (mid right)
      { x: 82, y: 65 },   // Sixth stop (bottom right area)
      { x: 88, y: 20 },   // End point near destination (top right)
      { x: 88, y: 45 },   // Ninth stop (mid right)
      { x: 70, y: 15 },   // Tenth stop (top right)
      { x: 35, y: 15 },   // Eleventh stop (top left)
      { x: 22, y: 45 },   // Twelfth stop (mid left)
      { x: 88, y: 55 },   // Final boss (right side, near treasure)
    ];
    
    // Return predefined points for each monster (index will match monster id - 1)
    if (index < pathPoints.length) {
      return pathPoints[index];
    }
    
    // Fallback for any additional monsters (shouldn't be needed)
    return { x: 50, y: 50 };
  };

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border-4 border-amber-900 relative overflow-hidden shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-amber-900/5"></div>
      
      {/* Map title with animated effect */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-extrabold text-amber-900 inline-block px-8 py-2 bg-amber-50/90 rounded-lg shadow-lg border-2 border-amber-800">
          SQL Jungle Adventure Map
        </h2>
        <p className="text-lg text-amber-800 mt-2 max-w-2xl mx-auto bg-amber-50/70 p-2 rounded-lg">
          Navigate through the treacherous jungle by defeating SQL monsters and unlocking new paths!
        </p>
      </motion.div>

      {/* Interactive Map with path and monsters */}
      <div className="relative h-[600px] w-full p-4 rounded-xl overflow-hidden shadow-inner border-2 border-amber-800">
        {/* Classic cartoon map background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/map3.jpg"
            alt="Classic Cartoon Map Background"
            fill
            style={{ objectFit: 'cover', opacity: 0.95 }}
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            className="bg-no-repeat bg-center bg-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-800/10 to-amber-700/20"></div>
        </div>

        {/* Map overlay texture for vintage feel - removed to show the actual map clearly */}

        {/* Map decorative elements - Compass rose */}
        <motion.div
          className="absolute top-[10%] left-[8%] z-10 opacity-90"
          initial={{ opacity: 0, rotate: -15, scale: 0 }}
          animate={{ opacity: 0.9, rotate: 0, scale: 1 }}
          transition={{ delay: 1, duration: 1, type: "spring" }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100">
            <motion.g 
              fill="none" 
              stroke="#614726" 
              strokeWidth="0.8" 
              opacity="0.9"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="50" cy="50" r="45" strokeWidth="1" stroke="#61472680" fill="#f5e9d680" />
              <path d="M50,5 L50,95 M5,50 L95,50" strokeWidth="1" />
              <path d="M26,26 L74,74 M26,74 L74,26" strokeWidth="0.5" strokeDasharray="1,2" />
              <path d="M50,10 L53,47 L50,50 L47,47 Z" fill="#8B3A13" stroke="#8B3A13" />
              <path d="M50,90 L53,53 L50,50 L47,53 Z" fill="#614726" stroke="#614726" />
              <path d="M10,50 L47,53 L50,50 L47,47 Z" fill="#614726" stroke="#614726" />
              <path d="M90,50 L53,53 L50,50 L53,47 Z" fill="#614726" stroke="#614726" />
              <text x="48" y="20" fill="#8B3A13" fontSize="8" fontWeight="bold">N</text>
              <text x="48" y="86" fill="#614726" fontSize="6">S</text>
              <text x="16" y="52" fill="#614726" fontSize="6">W</text>
              <text x="78" y="52" fill="#614726" fontSize="6">E</text>
              <circle cx="50" cy="50" r="4" fill="#61472680" />
              <circle cx="50" cy="50" r="2" fill="#8B3A1380" />
            </motion.g>
          </svg>
        </motion.div>

        {/* Treasure chest decorative element */}
        <motion.div
          className="absolute top-20 right-20 z-10 opacity-70"
          initial={{ opacity: 0, rotate: 10, scale: 0 }}
          animate={{ opacity: 0.7, rotate: 10, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <Image 
            src="https://images.unsplash.com/photo-1609697295609-86ae67f25794?q=80&w=300&auto=format&fit=crop"
            alt="Treasure"
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
        </motion.div>

        {/* Animated path through the jungle - with multiple segments connecting monsters */}
        <div className="absolute h-full w-full top-0 left-0 z-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Path texture/pattern */}
            <defs>
              <pattern id="pathPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <image 
                  href={journeyImages.pathTexture} 
                  x="0" y="0" 
                  width="10" height="10"
                  style={{ opacity: 0.5 }}
                />
              </pattern>
              
              {/* Filter for subtle path glow */}
              <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Decorative terrain features - old map style */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1.5 }}
            >
              {/* Stylized mountains */}
              <path d="M20,20 L25,10 L30,20" fill="none" stroke="#61462D" strokeWidth="0.5" opacity="0.6" />
              <path d="M70,15 L75,5 L80,15" fill="none" stroke="#61462D" strokeWidth="0.5" opacity="0.6" />
              <path d="M40,80 L45,70 L50,80" fill="none" stroke="#61462D" strokeWidth="0.5" opacity="0.6" />
              
              {/* Water areas */}
              <path d="M10,90 Q20,88 30,90 Q40,92 50,90 Q60,88 70,90" fill="none" stroke="#4171a1" strokeWidth="0.3" opacity="0.4" />
              <path d="M75,85 Q80,83 85,85 Q90,87 95,85" fill="none" stroke="#4171a1" strokeWidth="0.3" opacity="0.4" />
              
              {/* Forest patches */}
              <circle cx="15" cy="40" r="3" stroke="#2d4f1e" strokeWidth="0.1" fill="none" opacity="0.3" />
              <circle cx="65" cy="25" r="4" stroke="#2d4f1e" strokeWidth="0.1" fill="none" opacity="0.3" />
              <circle cx="85" cy="70" r="5" stroke="#2d4f1e" strokeWidth="0.1" fill="none" opacity="0.3" />
            </motion.g>
            
            {/* Main path with animated drawing effect - with glow effect */}
            <motion.path 
              d="M15,75 C20,70 25,40 30,35 C35,30 40,50 45,60 C48,65 52,30 55,25 C58,22 62,65 65,70 C68,73 72,50 75,40 C77,35 80,55 82,65 C83,70 86,30 88,20 C89,15 88,35 88,45 C88,50 75,20 70,15 C65,12 40,10 35,15 C30,18 25,40 22,45 C19,50 70,60 88,55" 
              stroke="#8B4513" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1,3"
              filter="url(#pathGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: showPathAnimation ? 1 : 0 }}
              transition={{ duration: 5, ease: "easeInOut" }}
              className="map-path-animation"
            />

            {/* Solid path underneath for better visibility - same curvy path */}
            <motion.path 
              d="M15,75 C20,70 25,40 30,35 C35,30 40,50 45,60 C48,65 52,30 55,25 C58,22 62,65 65,70 C68,73 72,50 75,40 C77,35 80,55 82,65 C83,70 86,30 88,20 C89,15 88,35 88,45 C88,50 75,20 70,15 C65,12 40,10 35,15 C30,18 25,40 22,45 C19,50 70,60 88,55" 
              stroke="#614726" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: showPathAnimation ? 1 : 0 }}
              transition={{ duration: 5, ease: "easeInOut", delay: 0.1 }}
            />

            {/* Path decorations */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: showPathAnimation ? 1 : 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              {/* X marks the spot treasures with subtle pulse animation */}
              {[
                { x: 38, y: 28 },
                { x: 60, y: 50 },
                { x: 25, y: 60 },
                { x: 82, y: 35 }
              ].map((pos, i) => (
                <motion.text
                  key={`treasure-${i}`}
                  x={pos.x}
                  y={pos.y}
                  fill="#8B3A13"
                  fontSize="3"
                  fontWeight="bold"
                  opacity="0.7"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1,
                    filter: ["drop-shadow(0 0 0px #8B3A13)", "drop-shadow(0 0 2px #8B3A13)", "drop-shadow(0 0 0px #8B3A13)"]
                  }}
                  transition={{ 
                    delay: 2.5 + (i * 0.3),
                    filter: {
                      repeat: Infinity,
                      duration: 2,
                      delay: 3 + (i * 0.5)
                    }
                  }}
                >
                  ×
                </motion.text>
              ))}
              
              {/* Small directional compass marks */}
              {[
                { x: 22, y: 55, r: -30 },
                { x: 52, y: 42, r: 45 },
                { x: 78, y: 53, r: 0 }
              ].map((pos, i) => (
                <motion.text
                  key={`compass-${i}`}
                  x={pos.x}
                  y={pos.y}
                  fill="#614726"
                  fontSize="2"
                  fontWeight="bold"
                  style={{ transform: `rotate(${pos.r}deg)` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 3 + (i * 0.3) }}
                >
                  ↑
                </motion.text>
              ))}
              
              {/* Dotted path markers */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle 
                  key={`dot-${i}`}
                  cx={15 + (i * 6)}
                  cy={75 - (i * 5)}
                  r={0.5}
                  fill="#614726"
                  opacity="0.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 3.5 + (i * 0.1) }}
                />
              ))}

              {/* Footprint decorations along the path */}
              {[
                { x: 18, y: 70, r: 10 },
                { x: 25, y: 50, r: -15 },
                { x: 38, y: 45, r: 5 },
                { x: 50, y: 40, r: 25 },
                { x: 60, y: 60, r: -20 },
                { x: 70, y: 50, r: 0 },
                { x: 80, y: 40, r: 15 }
              ].map((pos, i) => (
                <motion.g
                  key={`footprint-${i}`}
                  style={{ transformOrigin: 'center', transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg)` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 4 + (i * 0.2) }}
                >
                  <ellipse cx="0" cy="-0.5" rx="0.7" ry="1.2" fill="#614726" opacity="0.6" />
                  <ellipse cx="0" cy="0.8" rx="0.5" ry="0.8" fill="#614726" opacity="0.6" />
                </motion.g>
              ))}
            </motion.g>
          </svg>
        </div>

        {/* Character start position with animation - EduGuide character at start of path */}
        <motion.div 
          className="absolute bottom-[25%] left-[15%] z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
        >
          <div className="relative">
          <motion.div 
              className="relative w-20 h-20 bg-amber-100/80 rounded-full p-1 border-2 border-amber-700 overflow-hidden shadow-lg"
              animate={{ 
                y: [0, -5, 0],
                boxShadow: [
                  "0px 0px 8px 2px rgba(217, 119, 6, 0.2)",
                  "0px 0px 12px 4px rgba(217, 119, 6, 0.4)",
                  "0px 0px 8px 2px rgba(217, 119, 6, 0.2)"
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                boxShadow: {
                  repeat: Infinity,
                  duration: 3
                }
              }}
          >
            <Image 
                src="/eduguide-ready-for-quest.png"
              alt="EduGuide Character"
              fill
                style={{ objectFit: 'contain', objectPosition: 'center 40%' }}
                className="scale-[1.2]"
            />
          </motion.div>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center border-2 border-amber-800"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <span className="text-amber-100 text-xs font-bold">GO!</span>
            </motion.div>
          </div>
          <div className="text-xs font-bold bg-amber-100/90 px-3 py-1 rounded-md text-center mt-2 shadow-md border border-amber-500">
            START HERE
          </div>
        </motion.div>

        {/* Monsters along the path with staggered appearance - spread across map */}
        {SQLMonsters.map((monster, index) => {
          // Get position coordinates from our positioning function
          const position = getMonsterPosition(index, SQLMonsters.length);
          
          // Set stage completion status (for future use with saved progress)
          const isCompleted = false;
          const isActive = activeLevel === monster.id;
          const isHovered = hoveredLevel === monster.id;

          return (
            <motion.div 
              key={monster.id}
              className={`absolute z-20 cursor-pointer ${isActive || isHovered ? 'z-30' : ''}`}
              style={{ 
                left: `${position.x}%`, 
                top: `${position.y}%` 
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: isActive || isHovered ? 1.1 : 1,
                y: isActive || isHovered ? -5 : 0
              }}
              transition={{ 
                delay: 1 + (index * 0.15),
                duration: 0.5,
                scale: { duration: 0.2 }
              }}
              onMouseEnter={() => setHoveredLevel(monster.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => setActiveLevel(monster.id === activeLevel ? null : monster.id)}
            >
              {/* Level marker with monster image */}
              <div className={`relative w-16 h-16 rounded-full overflow-hidden border-4 ${isActive || isHovered ? 'border-yellow-500 shadow-lg shadow-yellow-300/50' : 'border-amber-700'} transition-all duration-300 bg-amber-100/80 monster-icon`}>
                <Image 
                  src={monster.image}
                  alt={monster.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  className={`transition-all duration-300 p-1 bg-white/90 ${isCompleted ? 'grayscale-0' : 'grayscale-[0%]'} ${isActive || isHovered ? 'grayscale-0 scale-110' : ''}`}
                />
                
                {/* Level number badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-800 border-2 border-amber-100 flex items-center justify-center text-amber-100 font-bold text-xs z-20">
                  {monster.id}
                </div>
              </div>
              
              {/* Monster name label - visible only on hover/active to reduce clutter */}
              {(isActive || isHovered) && (
                <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-md border w-max text-center transition-all duration-300 bg-yellow-100 border-yellow-500 scale-110`}>
                {monster.name}
              </div>
              )}

              {/* Info popup on hover or active */}
              {(isHovered || isActive) && (
                <motion.div 
                  className="absolute -right-4 top-0 transform translate-x-full bg-amber-50/95 p-3 rounded-lg shadow-xl border-2 border-amber-600 w-64 z-40"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-bold text-lg text-amber-900 border-b border-amber-200 pb-2 mb-2">{monster.name}</h3>
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 flex-shrink-0 bg-white">
                      <Image 
                        src={monster.image}
                        alt={monster.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-1"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-amber-800 font-medium">{monster.concept}</p>
                      <p className="text-xs text-amber-600 italic mt-1">Skill: {monster.skill}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-amber-800 bg-amber-100/60 p-2 rounded border border-amber-200">{monster.challenge}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Final Boss - Dragon's Lair Special Marker */}
        <motion.div 
          className="absolute top-[55%] right-[12%] z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 0.7, type: "spring" }}
        >
          <div className="relative">
            <motion.div 
              className="relative w-18 h-18 flex items-center justify-center"
              animate={{ 
                y: [0, -3, 0],
                filter: ["drop-shadow(0 0 4px rgba(255,0,0,0.3))", "drop-shadow(0 0 8px rgba(255,0,0,0.5))", "drop-shadow(0 0 4px rgba(255,0,0,0.3))"]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            >
              <svg width="40" height="40" viewBox="0 0 50 50">
                <motion.path 
                  d="M25,10 L30,20 L40,20 L32,27 L35,38 L25,32 L15,38 L18,27 L10,20 L20,20 Z" 
                  fill="#8B0000" 
                  stroke="#600000" 
                  strokeWidth="1"
                  animate={{ 
                    fill: ["#8B0000", "#b30000", "#8B0000"],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <motion.path 
                  d="M25,15 L28,22 L35,22 L30,27 L32,34 L25,30 L18,34 L20,27 L15,22 L22,22 Z" 
                  fill="#ff3333" 
                  stroke="none"
                  opacity="0.5"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-red-100 drop-shadow-lg">🐉</span>
              </div>
            </motion.div>
            <div className="text-center mt-2">
              <span className="text-xs font-bold bg-red-900/90 px-2 py-0.5 rounded-md shadow-md border border-red-700 text-red-100">
                Final Boss
              </span>
            </div>
          </div>
        </motion.div>

        {/* Final destination - Freedom Gate */}
        <motion.div 
          className="absolute top-[20%] right-[12%] z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.7, type: "spring" }}
        >
          <motion.div 
            className="relative w-24 h-24"
            animate={{ 
              boxShadow: ["0px 0px 8px 2px rgba(255,215,0,0.3)", "0px 0px 16px 4px rgba(255,215,0,0.6)", "0px 0px 8px 2px rgba(255,215,0,0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-lg border-4 border-yellow-600 overflow-hidden">
              <Image 
                src="/assets/freedom.jpg"
                alt="Freedom Gate"
                fill
                style={{ objectFit: 'cover' }}
                className="transition-all duration-500"
                unoptimized
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-yellow-600/40"></div>
              <div className="absolute top-0 left-0 right-0 bg-yellow-600/80 text-center text-white text-xs font-bold py-1">FREEDOM</div>
            </div>
            <div className="absolute -bottom-2 -right-2">
              <motion.span 
                className="text-2xl drop-shadow-lg" 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🏆
              </motion.span>
            </div>
          </motion.div>
          <div className="text-center mt-4">
            <span className="text-sm font-bold bg-yellow-500/90 px-3 py-1 rounded-lg shadow-md border border-yellow-600 text-amber-900">
              FREEDOM!
            </span>
          </div>
        </motion.div>
        
        {/* Map parchment texture overlay for aged effect */}
        <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-50/5 to-amber-100/10 mix-blend-overlay pointer-events-none"></div>
        
        {/* Ship illustration */}
        <motion.div
          className="absolute top-[80%] right-[30%] z-5 opacity-70 rotate-12"
          initial={{ opacity: 0, rotate: 12 }}
          animate={{ opacity: 0.7, rotate: 12 }}
          transition={{ delay: 2.2 }}
        >
          <Image 
            src="https://images.unsplash.com/photo-1594931670644-bfda4c4a3af8?q=80&w=500&auto=format&fit=crop"
            alt="Old ship"
            width={80}
            height={80}
            className="drop-shadow-md"
          />
        </motion.div>

        {/* Sea monster decoration */}
          <motion.div 
          className="absolute bottom-[5%] left-[20%] z-5 opacity-60"
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          >
              <Image
            src="https://images.unsplash.com/photo-1590873345919-9ca871aeb0c4?q=80&w=500&auto=format&fit=crop"
            alt="Sea monster"
            width={60}
            height={60}
            className="drop-shadow-md"
          />
          </motion.div>
      </div>

      {/* Start journey button */}
      <motion.div 
        className="text-center mt-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.5 }}
      >
        <p className="text-amber-800 mb-4 font-medium italic bg-amber-50/80 inline-block px-4 py-2 rounded-lg shadow">
          Are you ready to start your adventure and master SQL to escape the jungle?
        </p>
        <Button 
          onClick={onStartGame} 
          size="lg"
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg shadow-lg border-2 border-amber-800 transition-all hover:scale-105 rounded-xl"
        >
          <span className="mr-2">🚀</span> Begin Your Journey!
        </Button>
      </motion.div>

      {/* Map Legend with animated appearance */}
      <motion.div 
        className="absolute bottom-4 left-4 bg-amber-50/90 p-3 rounded-lg text-xs shadow-lg border border-amber-400 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.5, duration: 0.5 }}
      >
        <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-1">Map Legend:</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-amber-800">Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-700"></div>
            <span className="text-amber-800">SQL Monsters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span className="text-amber-800">Freedom Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-900"></div>
            <span className="text-amber-800">Adventure Path</span>
          </div>
        </div>
      </motion.div>
      
      {/* Progress indicator - for future implementation */}
      <motion.div 
        className="absolute top-4 right-4 bg-amber-50/90 py-2 px-3 rounded-lg text-xs shadow-lg border border-amber-400 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.5, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-900">Progress:</span>
          <div className="h-2 w-32 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: `0%` }}></div>
          </div>
          <span className="text-amber-800 font-medium">0/13</span>
        </div>
      </motion.div>
    </div>
  )
} 