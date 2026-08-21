"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import type { TabId } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export const DESKTOP_QUERY = "(min-width: 900px)";
export const MOBILE_QUERY = "(max-width: 899px)";

const PANEL_SELECTOR = [
  ".stack > .panel",
  ".grid-2 > .panel",
  ".timeline > .panel",
  ".note-list > .panel",
].join(", ");

const DETAIL_SELECTOR = [
  ".principle",
  ".skill-row",
  ".concept-card",
  ".education-item",
  ".facts > div",
].join(", ");

export function useGsapTab(
  activeTab: TabId,
  reducedMotion: boolean,
  enabled = true,
) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled || reducedMotion) return;

    const pick = (selector: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(selector));

    const mm = gsap.matchMedia();

    mm.add(DESKTOP_QUERY, () => {
      pick(".project-zigzag > .project").forEach((card, i) => {
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

      pick(PANEL_SELECTOR).forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 26, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: panel, start: "top 95%", once: true },
          },
        );
      });

      ScrollTrigger.refresh();
    });

    // Horizontal travel gets clipped on a phone, so mobile leans on bigger
    // vertical lifts plus staggered detail rows to make scrolling feel alive.
    mm.add(MOBILE_QUERY, () => {
      gsap.fromTo(
        root,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      pick(".project-zigzag > .project").forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 56,
            scale: 0.94,
            x: i % 2 === 0 ? -18 : 18,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            x: 0,
            duration: 0.7,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      pick(PANEL_SELECTOR).forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 64, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 94%", once: true },
          },
        );
      });

      pick(DETAIL_SELECTOR).forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: (i % 4) * 0.06,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 96%", once: true },
          },
        );
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, [activeTab, reducedMotion, enabled]);

  return rootRef;
}
