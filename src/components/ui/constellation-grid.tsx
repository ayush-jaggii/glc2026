'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    radius: number;
    label: string;
    pulse: number;
}

interface ConstellationGridProps {
    className?: string;
    children?: React.ReactNode;
    forceLightMode?: boolean;
    fixed?: boolean;
}

export default function ConstellationGrid({
    className = '',
    children,
    forceLightMode = true,
    fixed = false,
}: ConstellationGridProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(!forceLightMode);

    useEffect(() => {
        if (forceLightMode) {
            setIsDarkMode(false);
            return;
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [forceLightMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        const mouse = {
            x: -1000,
            y: -1000,
            prevX: -1000,
            prevY: -1000,
            vx: 0,
            vy: 0,
            radius: 220,
        };

        let nodes: Node[] = [];

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = fixed
                ? Math.max(window.innerWidth, document.documentElement.clientWidth || 0)
                : (canvas.parentElement?.offsetWidth || window.innerWidth);
            height = fixed
                ? Math.max(window.innerHeight, document.documentElement.clientHeight || 0)
                : (canvas.parentElement?.offsetHeight || window.innerHeight);

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
            initNodes();
        };

        const updatePosition = (clientX: number, clientY: number) => {
            if (fixed) {
                mouse.x = clientX;
                mouse.y = clientY;
            } else {
                const rect = canvas.getBoundingClientRect();
                mouse.x = clientX - rect.left;
                mouse.y = clientY - rect.top;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            updatePosition(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches && e.touches.length > 0) {
                updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const initNodes = () => {
            nodes = [];
            // Responsive spacing for mobile vs desktop
            const isMobile = width < 768;
            const spacing = isMobile ? 55 : 65;
            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    nodes.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        baseX: x,
                        baseY: y,
                        radius: Math.random() * 1.2 + 1.2,
                        label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
                        pulse: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchend', handleMouseLeave);

        let lastTime = performance.now();

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
            mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;

            const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

            const bgColor = isDarkMode ? '#08090C' : '#FFFFFF';
            const nodeColor = isDarkMode ? '255, 255, 255' : '15, 23, 42';
            const accentColor = '245, 130, 50'; // TAPMI Brand Orange

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            const SPRING_K = 18;
            const DAMPING = 0.82;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulse += dt * 2.5;

                // Ambient floating motion so constellation lives on mobile screens even without touch
                const ambientX = Math.sin(n.pulse * 0.4) * 0.4;
                const ambientY = Math.cos(n.pulse * 0.4) * 0.4;

                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && dist > 0) {
                    const power = (1 - dist / mouse.radius);
                    const force = power * (1500 + speed * 150);
                    const angle = Math.atan2(dy, dx);

                    n.vx -= Math.cos(angle) * force * dt;
                    n.vy -= Math.sin(angle) * force * dt;
                }

                const homeDx = (n.baseX + ambientX) - n.x;
                const homeDy = (n.baseY + ambientY) - n.y;

                n.vx += homeDx * SPRING_K * dt;
                n.vy += homeDy * SPRING_K * dt;

                n.vx *= DAMPING;
                n.vy *= DAMPING;

                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;
            }

            // Draw Connections
            const isMobile = width < 768;
            const MAX_CONN_DIST = isMobile ? 65 : 75;
            const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const ndx = n.x - n2.x;
                    const ndy = n.y - n2.y;
                    const distSq = ndx * ndx + ndy * ndy;

                    if (distSq < MAX_CONN_DIST_SQ) {
                        const nDist = Math.sqrt(distSq);
                        const alpha = (1 - nDist / MAX_CONN_DIST) * (isDarkMode ? 0.2 : 0.07);

                        ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }
            }

            // Render Nodes & Proximity Rings
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const isNear = dist < mouse.radius;

                const baseAlpha = isNear ? 0.95 : (isDarkMode ? 0.28 : 0.16) + Math.sin(n.pulse) * 0.08;

                ctx.fillStyle = isNear
                    ? `rgba(${accentColor}, ${baseAlpha})`
                    : `rgba(${nodeColor}, ${baseAlpha})`;

                const currentRadius = isNear
                    ? n.radius * 2.2
                    : n.radius + Math.sin(n.pulse) * 0.3;

                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
                ctx.fill();

                if (dist < 90) {
                    const pulseRing = ((n.pulse * 20) % 30) + 4;
                    const ringAlpha = (1 - pulseRing / 34) * 0.5;

                    ctx.strokeStyle = `rgba(${accentColor}, ${ringAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
                    ctx.fillStyle = `rgba(${accentColor}, 0.85)`;
                    ctx.fillText(n.label, n.x + 10, n.y - 10);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchend', handleMouseLeave);
        };
    }, [isDarkMode, fixed]);

    if (fixed) {
        return (
            <>
                <canvas
                    ref={canvasRef}
                    className="fixed inset-0 z-0 block pointer-events-none w-full h-full"
                />
                {children && <div className="relative z-10 w-full">{children}</div>}
            </>
        );
    }

    return (
        <div className={`relative w-full overflow-hidden select-none ${className}`}>
            <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none w-full h-full" />
            {children && <div className="relative z-10 w-full h-full">{children}</div>}
        </div>
    );
}
