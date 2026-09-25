'use client'

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

interface BloimAnimationBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const Component = ({ className, children }: BloimAnimationBackgroundProps) => {
  const { width, height } = useWindowSize();

  return (
    <div className={cn("relative flex flex-col items-center justify-center overflow-hidden", className)}>
      <UnicornScene 
        production={true} 
        projectId="9tVO0xGS8DIar1DF4Sqc" 
        width={width} 
        height={height} 
      />
      {children}
    </div>
  );
};

export default Component;
