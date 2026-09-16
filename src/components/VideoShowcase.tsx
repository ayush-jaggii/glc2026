'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Volume2, VolumeX } from 'lucide-react'
import { EVENT_DETAILS } from '@/data/eventData'

export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasLoaded(true)
            // Send play command if already loaded
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
                '*'
              )
            }
          } else {
            // Pause video when scrolled out of view to preserve resources
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
                '*'
              )
            }
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of the video is visible
        rootMargin: '0px 0px -50px 0px',
      }
    )

    const currentEl = containerRef.current
    if (currentEl) {
      observer.observe(currentEl)
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl)
      }
      observer.disconnect()
    }
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

  // YouTube embed URL with autoplay, muted initial state, loop, inline playback, and JS API enabled
  const youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${EVENT_DETAILS.youtubeVideoId}?enablejsapi=1&autoplay=1&mute=1&playsinline=1&controls=1&rel=0&modestbranding=1&loop=1&playlist=${EVENT_DETAILS.youtubeVideoId}`

  return (
    <div ref={containerRef} className="relative my-16 sm:my-20">
      <div className="relative rounded-xl overflow-hidden border border-wine-800 bg-black shadow-2xl group">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {hasLoaded ? (
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
          ) : (
            <div className="relative w-full h-full bg-wine-950">
              <Image
                src="/images/stage/stage-backdrop.jpg"
                alt="GLC Auditorium Stage"
                fill
                className="object-cover object-center brightness-90"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/40" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

