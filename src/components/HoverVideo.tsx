'use client';

import React, { useRef, useEffect, useState } from 'react';

interface HoverVideoProps {
  src: string;
  className?: string;
  alt?: string;
}

export default function HoverVideo({ src, className, alt }: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [urlIndex, setUrlIndex] = useState(0);

  // Generate fallback URLs
  const getFallbackUrls = (originalSrc: string) => {
    const urls = [originalSrc];
    
    // If the original URL has .mp4 extension, try without it
    if (originalSrc.endsWith('.mp4')) {
      urls.push(originalSrc.replace('.mp4', ''));
    } else {
      // If the original URL doesn't have .mp4 extension, try with it
      urls.push(originalSrc + '.mp4');
    }
    
    // Try with different file extensions
    if (!originalSrc.endsWith('.webm')) {
      urls.push(originalSrc.replace('.mp4', '.webm'));
    }
    if (!originalSrc.endsWith('.mov')) {
      urls.push(originalSrc.replace('.mp4', '.mov'));
    }
    
    return urls;
  };

  const fallbackUrls = getFallbackUrls(src);

  useEffect(() => {
    if (videoRef.current && currentSrc) {
      // Try to load the video
      videoRef.current.load();
    }
  }, [currentSrc, urlIndex, fallbackUrls]);

  const handleError = () => {
    // Try next fallback URL
    if (urlIndex < fallbackUrls.length - 1) {
      const nextIndex = urlIndex + 1;
      const nextUrl = fallbackUrls[nextIndex];
      setUrlIndex(nextIndex);
      setCurrentSrc(nextUrl);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={currentSrc}
        className="w-full h-full object-cover"
        muted
        loop
        autoPlay
        playsInline
        controls={false}
        onError={handleError}
      />
    </div>
  );
} 