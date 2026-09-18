"use client";
import Image from "next/image";
import React from "react";
import { Linkedin, ExternalLink } from "lucide-react";

export interface AccordionItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags?: string[];
  href?: string;
  linkedin?: string;
  track?: string;
  company?: string;
  designation?: string;
}

const defaultItems: AccordionItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=960&auto=format&fit=crop",
    title: "Adrian Paul",
    description: "COO & Co-Founder",
    tags: ["Floral", "Highlands", "Wildflowers", "Colorful", "Resilience"],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=960&auto=format&fit=crop",
    title: "Flualy Cual",
    description: "Founder & CEO",
    tags: ["Twilight", "Peaks", "Silhouette", "Evening Sky", "Peaceful"],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=960&auto=format&fit=crop",
    title: "Naymur Rahman",
    description: "CTO & Co-Founder",
    tags: ["Rocky", "Ridges", "Contrast", "Adventure", "Clouds"],
  },
];

interface TailwindImageAccordionProps {
  items?: AccordionItem[];
  className?: string;
}

export function TailwindImageAccordion({
  items = defaultItems,
  className = "",
}: TailwindImageAccordionProps) {
  const displayItems = items && items.length > 0 ? items : defaultItems;

  return (
    <div className={`group flex max-md:flex-col justify-center gap-2 w-full md:w-[92%] lg:w-[88%] mx-auto mb-10 mt-3 ${className}`}>
      {displayItems.map((item) => {
        const linkHref = item?.linkedin || item?.href || "#";
        const isExternal = linkHref.startsWith("http");

        return (
          <article
            key={item?.id ?? item?.title}
            className="group/article relative w-full rounded-xl overflow-hidden md:not-[&:hover]:group-hover:w-[15%] md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[15%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-2/3 before:bg-gradient-to-t before:from-black/90 before:via-black/50 before:to-transparent before:transition-opacity md:before:opacity-60 md:hover:before:opacity-95 focus-within:before:opacity-95 after:opacity-0 md:not-[&:hover]:group-hover:after:opacity-100 md:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 after:absolute after:inset-0 after:bg-black/40 after:backdrop-blur-[1px] after:rounded-xl after:transition-all focus-within:ring-2 focus-within:ring-glc-magenta/70 border border-wine-800/60 shadow-xl"
          >
            <a
              className="absolute inset-0 text-white z-10 p-4 sm:p-5 flex flex-col justify-end"
              href={linkHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={`View ${item?.title}'s profile`}
            >
              {/* Optional Panel Track Pill */}
              {item?.track && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-glc-magenta/80 text-white w-fit mb-2 md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 transition-opacity duration-200">
                  {item.track}
                </span>
              )}

              {/* Title / Name */}
              <h3 className="text-lg sm:text-xl font-bold text-cream-50 md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-150 group-focus-within/article:delay-150 flex items-center gap-1.5">
                <span>{item?.title}</span>
                {item?.linkedin && (
                  <Linkedin className="w-4 h-4 text-[#0077B5] inline shrink-0" />
                )}
              </h3>

              {/* Description / Role */}
              <span className="text-xs sm:text-sm font-medium text-cream-200/90 md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300">
                {item?.description}
              </span>

              {/* Company line if separate */}
              {item?.company && item?.company !== item?.description && (
                <span className="text-[11px] font-mono text-glc-orange/90 mt-1 md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 transition-opacity duration-200 delay-500">
                  {item.company}
                </span>
              )}

              {/* Direct LinkedIn CTA */}
              {item?.linkedin && (
                <div className="mt-2.5 pt-2 border-t border-wine-700/60 flex items-center gap-1 text-[11px] font-semibold text-glc-pink hover:text-white transition-colors md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 delay-500">
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </a>

            <div className="relative h-72 md:h-[460px] w-full bg-wine-950 overflow-hidden">
              <Image
                className="object-cover object-top h-full w-full filter grayscale contrast-[1.18] brightness-[0.88] group-hover/article:grayscale-0 group-hover/article:contrast-[1.05] group-hover/article:brightness-105 group-hover/article:scale-105 transition-all duration-500 ease-out"
                src={item?.url}
                width={960}
                height={480}
                alt={item?.title || "Panelist"}
                priority={false}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default TailwindImageAccordion;
