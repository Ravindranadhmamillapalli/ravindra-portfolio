"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import type { TabId } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export function useGsapTab(
  activeTab: TabId,
  reducedMotion: boolean,
  enabled = true,
) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled || reducedMotion) return;

    const ctx = gsap.context(() => {
      const projects = gsap.utils.toArray<HTMLElement>(
        ".project-zigzag > .project",
      );

      projects.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -110 : 110 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      const panels = gsap.utils.toArray<HTMLElement>(
        [
          ".stack > .panel",
          ".grid-2 > .panel",
          ".timeline > .panel",
          ".note-list > .panel",
        ].join(", "),
      );

      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 26, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 95%",
              once: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [activeTab, reducedMotion, enabled]);

  return rootRef;
}
