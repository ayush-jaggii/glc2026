'use client';

import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
	fadeIn: {
		start: number;
		end: number;
	};
	fadeOut: {
		start: number;
		end: number;
	};
}

interface BlurSettings {
	blurIn: {
		start: number;
		end: number;
	};
	blurOut: {
		start: number;
		end: number;
	};
	maxBlur: number;
}

export interface InfiniteGalleryProps {
	images: ImageItem[];
	speed?: number;
	zSpacing?: number;
	visibleCount?: number;
	falloff?: { near: number; far: number };
	fadeSettings?: FadeSettings;
	blurSettings?: BlurSettings;
	className?: string;
	style?: React.CSSProperties;
	scrollProgress?: number;
	autoPlay?: boolean;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	x: number;
	y: number; 
}

const DEFAULT_DEPTH_RANGE = 50;

const createClothMaterial = () => {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			map: { value: null },
			opacity: { value: 1.0 },
			blurAmount: { value: 0.0 },
			scrollForce: { value: 0.0 },
			time: { value: 0.0 },
			isHovered: { value: 0.0 },
		},
		vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Smooth curvature based on scroll velocity
        float curveIntensity = scrollForce * 0.25;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        
        // Dynamic cloth ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 1.5;
        
        // Flag waving when hovered
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = sin(wavePhase) * 0.08 * dampening;
        }
        
        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vec4 color = texture2D(map, vUv);
        
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        
        float curveHighlight = abs(scrollForce) * 0.04;
        color.rgb += vec3(curveHighlight * 0.08);
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
	});
};

function ImagePlane({
	texture,
	position,
	scale,
	material,
}: {
	texture: THREE.Texture;
	position: [number, number, number];
	scale: [number, number, number];
	material: THREE.ShaderMaterial;
}) {
	const meshRef = useRef<THREE.Mesh>(null);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (material && texture) {
			material.uniforms.map.value = texture;
		}
	}, [material, texture]);

	useEffect(() => {
		if (material && material.uniforms) {
			material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
		}
	}, [material, isHovered]);

	return (
		<mesh
			ref={meshRef}
			position={position}
			scale={scale}
			material={material}
			onPointerEnter={() => setIsHovered(true)}
			onPointerLeave={() => setIsHovered(false)}
		>
			<planeGeometry args={[1, 1, 32, 32]} />
		</mesh>
	);
}

// Alternating spatial offsets around center so "GLC" remains prominent and visible
const SEQUENTIAL_OFFSETS = [
	{ x: -2.8, y: 0.6 },
	{ x: 3.0, y: -0.7 },
	{ x: -2.2, y: -1.3 },
	{ x: 2.5, y: 1.4 },
	{ x: -3.1, y: 0.1 },
	{ x: 2.9, y: -0.8 },
	{ x: -2.0, y: 1.2 },
	{ x: 2.6, y: -1.1 },
	{ x: -2.7, y: -0.4 },
	{ x: 2.2, y: 0.7 },
];

function GalleryScene({
	images,
	speed = 1,
	visibleCount = 10,
	scrollProgress,
	autoPlay: initialAutoPlay = false,
}: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
	const [scrollVelocity, setScrollVelocity] = useState(0);
	const isScrollControlled = scrollProgress !== undefined;
	const [autoPlay, setAutoPlay] = useState(isScrollControlled ? false : initialAutoPlay);
	const lastInteraction = useRef(Date.now());
	const currentZOffset = useRef(0);

	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	const totalImages = normalizedImages.length;
	const effectiveCount = isScrollControlled ? totalImages : visibleCount;

	const textures = useTexture(normalizedImages.map((img) => img.src));

	const materials = useMemo(
		() => Array.from({ length: effectiveCount }, () => createClothMaterial()),
		[effectiveCount]
	);

	// Spacing and range for sequential scroll journey
	const spacing = 7.0;
	// Total travel so that the furthest plane (starts at -(totalImages)*spacing) flies all the way through to +6
	const totalTravel = (totalImages + 0.8) * spacing;

	// Initial planes setup
	const planesData = useRef<PlaneData[]>(
		Array.from({ length: effectiveCount }, (_, i) => ({
			index: i,
			z: -(i + 1) * spacing,
			imageIndex: i % totalImages,
			x: SEQUENTIAL_OFFSETS[i % SEQUENTIAL_OFFSETS.length].x,
			y: SEQUENTIAL_OFFSETS[i % SEQUENTIAL_OFFSETS.length].y,
		}))
	);

	useEffect(() => {
		planesData.current = Array.from({ length: effectiveCount }, (_, i) => ({
			index: i,
			z: -(i + 1) * spacing,
			imageIndex: i % totalImages,
			x: SEQUENTIAL_OFFSETS[i % SEQUENTIAL_OFFSETS.length].x,
			y: SEQUENTIAL_OFFSETS[i % SEQUENTIAL_OFFSETS.length].y,
		}));
	}, [effectiveCount, totalImages, spacing]);

	// Standalone wheel/keyboard (disabled when controlled by page scroll)
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			if (isScrollControlled) return;
			event.preventDefault();
			setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
			setAutoPlay(false);
			lastInteraction.current = Date.now();
		},
		[speed, isScrollControlled]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (isScrollControlled) return;
			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				setScrollVelocity((prev) => prev - 2 * speed);
				setAutoPlay(false);
				lastInteraction.current = Date.now();
			} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				setScrollVelocity((prev) => prev + 2 * speed);
				setAutoPlay(false);
				lastInteraction.current = Date.now();
			}
		},
		[speed, isScrollControlled]
	);

	useEffect(() => {
		if (isScrollControlled) return;
		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.addEventListener('wheel', handleWheel, { passive: false });
			document.addEventListener('keydown', handleKeyDown);

			return () => {
				canvas.removeEventListener('wheel', handleWheel);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [handleWheel, handleKeyDown, isScrollControlled]);

	useFrame((state, delta) => {
		let currentVelocity = scrollVelocity;

		if (isScrollControlled) {
			// Directly driven by page scroll progress (0.0 to 1.0)
			const targetTravel = (scrollProgress ?? 0) * totalTravel;
			const deltaDiff = targetTravel - currentZOffset.current;
			// Smooth physics lerp
			currentZOffset.current += deltaDiff * 0.16;
			currentVelocity = deltaDiff * 6.0;
		} else {
			if (autoPlay) {
				setScrollVelocity((prev) => prev + 0.3 * delta);
			}
			setScrollVelocity((prev) => prev * 0.95);
			currentZOffset.current += scrollVelocity * delta * 10;
		}

		// Update shader uniforms
		const time = state.clock.getElapsedTime();
		materials.forEach((material) => {
			if (material && material.uniforms) {
				material.uniforms.time.value = time;
				material.uniforms.scrollForce.value = currentVelocity;
			}
		});

		// Position every plane along the flight trajectory
		planesData.current.forEach((plane, i) => {
			const initialZ = -(i + 1) * spacing;
			const worldZ = initialZ + currentZOffset.current;
			plane.z = worldZ;

			const offset = SEQUENTIAL_OFFSETS[i % SEQUENTIAL_OFFSETS.length];
			plane.x = offset.x;
			plane.y = offset.y;

			// Opacity curve:
			// Fully visible while approaching camera from distance (-65 to -1)
			// Smoothly fades out as it flies behind/beside camera (0 to +7)
			// Smoothly fades in from deep distance (-80 to -65)
			let opacity = 1.0;
			if (worldZ < -80) {
				opacity = 0.0;
			} else if (worldZ < -60) {
				opacity = (worldZ - (-80)) / 20;
			} else if (worldZ <= -1) {
				opacity = 1.0;
			} else if (worldZ < 7) {
				opacity = 1.0 - (worldZ - (-1)) / 8;
			} else {
				opacity = 0.0;
			}

			opacity = Math.max(0, Math.min(1, opacity));

			const material = materials[i];
			if (material && material.uniforms) {
				material.uniforms.opacity.value = opacity;
				material.uniforms.blurAmount.value = 0.0;
			}
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{planesData.current.map((plane, i) => {
				const texture = textures[plane.imageIndex];
				const material = materials[i];

				if (!texture || !material) return null;

				const aspect = texture.image
					? texture.image.width / texture.image.height
					: 1.5;
				// Clean, high-impact photo scale
				const scale: [number, number, number] =
					aspect > 1 ? [2.5 * aspect, 2.5, 1] : [2.5, 2.5 / aspect, 1];

				return (
					<ImagePlane
						key={plane.index}
						texture={texture}
						position={[plane.x, plane.y, plane.z]}
						scale={scale}
						material={material}
					/>
				);
			})}
		</>
	);
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	return (
		<div className="flex flex-col items-center justify-center h-full bg-wine-950 p-4">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
				{normalizedImages.map((img, i) => (
					<img
						key={i}
						src={img.src || '/placeholder.svg'}
						alt={img.alt || 'GLC Past Edition'}
						className="w-full h-32 object-cover rounded-lg border border-wine-800"
					/>
				))}
			</div>
		</div>
	);
}

export default function InfiniteGallery({
	images,
	className = 'h-96 w-full',
	style,
	speed = 1,
	zSpacing = 3,
	visibleCount = 10,
	fadeSettings,
	blurSettings,
	scrollProgress,
	autoPlay,
}: InfiniteGalleryProps) {
	const [webglSupported, setWebglSupported] = useState(true);

	useEffect(() => {
		try {
			const canvas = document.createElement('canvas');
			const gl =
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) {
				setWebglSupported(false);
			}
		} catch (e) {
			setWebglSupported(false);
		}
	}, []);

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<FallbackGallery images={images} />
			</div>
		);
	}

	return (
		<div className={className} style={style}>
			<Canvas
				camera={{ position: [0, 0, 0], fov: 52 }}
				gl={{ antialias: true, alpha: true }}
			>
				<Suspense fallback={null}>
					<GalleryScene
						images={images}
						speed={speed}
						zSpacing={zSpacing}
						visibleCount={visibleCount}
						fadeSettings={fadeSettings}
						blurSettings={blurSettings}
						scrollProgress={scrollProgress}
						autoPlay={autoPlay}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}
