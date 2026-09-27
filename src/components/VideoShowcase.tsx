'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { EVENT_DETAILS } from '@/data/eventData'

export default function VideoShowcase() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Start playing immediately on website load
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSound = () => {
    if (iframeRef.current?.contentWindow) {
      if (isMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
          '*'
        )
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        )
        setIsMuted(false)
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'mute', args: '' }),
          '*'
        )
        setIsMuted(true)
      }
    }
  }

  // YouTube embed URL with autoplay on load, muted initial state, infinite loop, and JS API enabled
  const youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${EVENT_DETAILS.youtubeVideoId}?enablejsapi=1&autoplay=1&mute=1&playsinline=1&controls=1&rel=0&modestbranding=1&loop=1&playlist=${EVENT_DETAILS.youtubeVideoId}`

  return (
    <div className="relative my-16 sm:my-20">
      <div className="relative rounded-xl overflow-hidden border border-wine-800 bg-black shadow-2xl group">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {isMounted && (
            <div className="relative w-full h-full bg-black">
              <iframe
                ref={iframeRef}
                src={youtubeEmbedUrl}
                title="GLC Official Recap Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />

              {/* Sound Toggle Button (Icon only, no text) */}
              <button
                onClick={toggleSound}
                type="button"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-cream-100 hover:text-white transition-all backdrop-blur-md shadow-lg"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                title={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#ffc5b6]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-glc-orange" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

