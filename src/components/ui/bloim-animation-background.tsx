'use client'

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

interface BloimAnimationBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  jsonFilePath?: string;
  projectId?: string;
}

export const Component = ({ 
  className, 
  children,
  jsonFilePath = "/scenes/glc-bloim.json",
  projectId
}: BloimAnimationBackgroundProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-center overflow-hidden", className)}>
      {mounted && (
        <UnicornScene 
          production={true} 
          {...(projectId ? { projectId } : { jsonFilePath })}
          width="100%" 
          height="100%"
          scale={1}
          dpi={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1.5, 2) : 1.5}
          fps={60}
          lazyLoad={false}
          className="w-full h-full"
        />
      )}
      {children}
    </div>
  );
};

export default Component;
