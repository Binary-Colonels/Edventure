"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'
import { generateSpeech, playAudio, stopAudio, getVoiceForSpeaker, isTextToSpeechEnabled } from '@/lib/elevenLabsAPI'

interface DialogBoxProps {
  text: string[]
  speaker: 'character' | 'monster' | 'narrator'
  speakerName: string
  onComplete: () => void
  monsterImage?: string // Add optional monsterImage prop
}

export default function DialogBox({ text, speaker, speakerName, onComplete, monsterImage }: DialogBoxProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false)
  const audioBlobRef = useRef<Blob | null>(null)
  const typingSpeed = 30 // milliseconds per character
  const textToSpeechEnabled = isTextToSpeechEnabled()

  useEffect(() => {
    if (currentTextIndex >= text.length) {
      return
    }

    const currentTextToType = text[currentTextIndex]
    
    if (!isTyping) {
      setDisplayedText(currentTextToType)
      return
    }

    let charIndex = 0
    setDisplayedText('')
    
    const typingInterval = setInterval(() => {
      if (charIndex < currentTextToType.length) {
        setDisplayedText(prev => prev + currentTextToType.charAt(charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, typingSpeed)
    
    return () => clearInterval(typingInterval)
  }, [currentTextIndex, text, isTyping])

  // Effect to handle text-to-speech when text changes
  useEffect(() => {
    // If text-to-speech is disabled, skip all audio processing
    if (!textToSpeechEnabled) {
      return
    }

    // Stop previous audio when text changes
    stopAudio()
    setIsSpeaking(false)

    if (currentTextIndex >= text.length || !audioEnabled) {
      return
    }

    const currentText = text[currentTextIndex]
    
    // Generate and play speech for the current text
    const generateAndPlaySpeech = async () => {
      try {
        setIsGeneratingSpeech(true)
        // Get appropriate voice for the speaker
        const voiceId = getVoiceForSpeaker(speaker)
        
        // Generate speech
        const audioBlob = await generateSpeech(currentText, voiceId)
        audioBlobRef.current = audioBlob
        
        // Play audio if not typing (full text is displayed)
        if (!isTyping && audioEnabled) {
          setIsSpeaking(true)
          await playAudio(audioBlob)
          setIsSpeaking(false)
        }
      } catch (error) {
        console.error('Error generating or playing speech:', error)
      } finally {
        setIsGeneratingSpeech(false)
      }
    }

    generateAndPlaySpeech()
    
    // Clean up audio when component unmounts
    return () => {
      stopAudio()
    }
  }, [currentTextIndex, text, speaker, audioEnabled, textToSpeechEnabled])

  // Play speech when typing stops if audio is enabled
  useEffect(() => {
    if (!textToSpeechEnabled) {
      return
    }
    
    if (!isTyping && audioBlobRef.current && audioEnabled && !isSpeaking) {
      const playCurrentAudio = async () => {
        setIsSpeaking(true)
        await playAudio(audioBlobRef.current!)
        setIsSpeaking(false)
      }
      
      playCurrentAudio()
    }
  }, [isTyping, audioEnabled, isSpeaking, textToSpeechEnabled])

  const handleNext = () => {
    if (isTyping) {
      // If typing, show all text immediately
      setIsTyping(false)
      return
    }
    
    // Stop current audio playback
    if (textToSpeechEnabled) {
      stopAudio()
      setIsSpeaking(false)
    }
    
    const nextIndex = currentTextIndex + 1
    if (nextIndex < text.length) {
      setCurrentTextIndex(nextIndex)
      setIsTyping(true)
    } else {
      onComplete()
    }
  }

  const toggleAudio = () => {
    if (!textToSpeechEnabled) {
      return
    }
    
    if (audioEnabled) {
      stopAudio()
      setIsSpeaking(false)
    } else if (audioBlobRef.current) {
      playAudio(audioBlobRef.current)
      setIsSpeaking(true)
    }
    setAudioEnabled(!audioEnabled)
  }

  // Get avatar based on speaker and context
  const getAvatar = () => {
    if (speaker === 'monster') {
      // Use the specific monster image if provided, otherwise fallback to generic image
      return monsterImage || '/sql-game/monsters/monster1.png'
    }
    
    // Different EduGuide images for different contexts
    const currentText = text[currentTextIndex]?.toLowerCase() || ''
    
    if (speaker === 'character') {
      if (currentText.includes('congratulations') || currentText.includes('well done') || currentText.includes('great job')) {
        return '/sql-game/eduguide/eduguide-happy.png'
      } else if (currentText.includes('incorrect') || currentText.includes('failed') || currentText.includes('try again')) {
        return '/sql-game/eduguide/eduguide-frustrated.png'
      } else if (currentText.includes('hint') || currentText.includes('tip') || currentText.includes('advice')) {
        return '/sql-game/eduguide/eduguide-giving-advice.png'
      } else if (currentText.includes('hello') || currentText.includes('hi') || currentText.includes('welcome')) {
        return '/sql-game/eduguide/eduguide-says-hi.png'
      } else if (currentText.includes('ready') || currentText.includes('begin') || currentText.includes('start')) {
        return '/sql-game/eduguide/eduguide-ready-for-quest.png'
      } else if (currentText.includes('learn') || currentText.includes('study') || currentText.includes('concept')) {
        return '/sql-game/eduguide/eduguide-ready-to-learn.jpeg.png'
      } else {
        return '/sql-game/eduguide/eduguide-ready-for-quest.png'
      }
    }
    
    // For narrator, use different emotions based on the message
    if (currentText.includes('congratulations') || currentText.includes('victory') || currentText.includes('complete')) {
      return '/sql-game/eduguide/eduguide-trophy.png'
    } else if (currentText.includes('incorrect') || currentText.includes('failed') || currentText.includes('try again')) {
      return '/sql-game/eduguide/eduguide-sad.png'
    } else if (currentText.includes('welcome') || currentText.includes('begin') || currentText.includes('start')) {
      return '/sql-game/eduguide/eduguide-says-hi.png'
    } else if (currentText.includes('learn') || currentText.includes('master') || currentText.includes('skill')) {
      return '/sql-game/eduguide/eduguide-ready-to-learn.jpeg.png'
    } else {
      return '/sql-game/eduguide/eduguide-ready-for-quest.png'
    }
  }

  // Function to determine dialog box color scheme based on speaker
  const getDialogStyle = () => {
    if (speaker === 'monster') {
      return {
        bgColor: 'bg-indigo-100/95',
        borderColor: 'border-indigo-500',
        nameColor: 'text-indigo-800',
        textBgColor: 'bg-white/80',
        buttonColor: 'bg-purple-900 hover:bg-indigo-700'
      }
    } else if (speaker === 'character') {
      return {
        bgColor: 'bg-blue-100/95',
        borderColor: 'border-blue-500',
        nameColor: 'text-blue-800',
        textBgColor: 'bg-white/80',
        buttonColor: 'bg-blue-600 hover:bg-blue-700'
      }
    } else {
      return {
        bgColor: 'bg-indigo-100/95',
        borderColor: 'border-indigo-500',
        nameColor: 'text-indigo-800',
        textBgColor: 'bg-white/80',
        buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
      }
    }
  }

  const style = getDialogStyle()

  return (
    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-[95%] max-w-4xl z-40 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
      {/* Pixel art dialog box */}
      <div className={`${style.bgColor} border-4 ${style.borderColor} rounded-lg p-2 md:p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-4 border-white shadow-md flex-shrink-0">
            <Image 
              src={getAvatar()}
              alt={speakerName}
              fill
              style={{ objectFit: 'contain' }}
              className={speaker === 'monster' ? 'bg-white/90 p-1' : ''}
            />
            <div className="absolute inset-0 border-4 border-dashed border-opacity-10"></div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            {/* Speaker name with pixel art background */}
            <div className={`inline-flex items-center px-4 py-1 rounded-t-lg ${style.nameColor} font-bold bg-white shadow-sm border-2 ${style.borderColor} text-sm relative -top-2`}>
              {speakerName}
              
              {/* Audio toggle button - only show if text-to-speech is enabled */}
              {textToSpeechEnabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-6 w-6 rounded-full"
                  onClick={toggleAudio}
                  disabled={isGeneratingSpeech}
                >
                  {audioEnabled ? (
                    <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-green-500' : ''}`} />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            
            {/* Text content with pixel font style */}
            <div className={`${style.textBgColor} min-h-[5rem] p-3 rounded-lg border-2 ${style.borderColor} font-medium`}>
              {displayedText}
              {isTyping && <span className="animate-pulse">▎</span>}
            </div>
          </div>
        </div>
        
        {/* Bottom control with pixelated button */}
        <div className="mt-3 flex justify-end">
          <Button 
            onClick={handleNext}
            className={`${style.buttonColor} rounded-md shadow-md px-3 py-1 border-2 border-white text-white`}
          >
            {isTyping ? 'Skip' : currentTextIndex === text.length - 1 ? 'Continue' : 'Next'} 
            {!isTyping && <span className="ml-2 animate-bounce inline-block">▼</span>}
          </Button>
        </div>
      </div>
    </div>
  )
} 