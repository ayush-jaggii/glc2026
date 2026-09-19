"use client";

import {
  type AnimationPlaybackControls,
  animate,
  motion,
  useMotionValue,
  useTransform,
  useInView,
  type ValueAnimationTransition,
} from "motion/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export type CountingNumberRef = {
  startAnimation: () => void;
};

export type CountingNumberProps = {
  from?: number;
  target: number;
  transition?: ValueAnimationTransition;
  className?: string;
  onStart?: () => void;
  onComplete?: () => void;
  autoStart?: boolean;
};

export const CountingNumber = forwardRef<
  CountingNumberRef,
  CountingNumberProps
>(
  (
    {
      from = 0,
      target = 100,
      transition = { duration: 2.5, ease: "easeOut", type: "tween" },
      className,
      onStart,
      onComplete,
      autoStart = true,
      ...props
    },
    ref,
  ) => {
    const elementRef = useRef<HTMLSpanElement | null>(null);
    const isInView = useInView(elementRef, { once: true, margin: "0px 0px -60px 0px" });

    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) =>
      Math.round(latest).toLocaleString(),
    );
    const controlsRef = useRef<AnimationPlaybackControls | null>(null);

    const startAnimation = useCallback(() => {
      controlsRef.current?.stop();
      onStart?.();
      count.set(from);
      controlsRef.current = animate(count, target, {
        ...transition,
        onComplete: () => onComplete?.(),
      });
    }, [from, target, transition, onStart, onComplete, count]);

    useImperativeHandle(ref, () => ({ startAnimation }));

    useEffect(() => {
      if (autoStart && isInView) {
        startAnimation();
      }
      return () => controlsRef.current?.stop();
    }, [autoStart, isInView, startAnimation]);

    return (
      <motion.span ref={elementRef} className={cn("tabular-nums", className)} {...props}>
        {rounded}
      </motion.span>
    );
  },
);

CountingNumber.displayName = "CountingNumber";

export default CountingNumber;
