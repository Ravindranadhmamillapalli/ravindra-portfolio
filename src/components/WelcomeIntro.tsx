"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { hero } from "@/data/portfolio";

export default function WelcomeIntro({
  reducedMotion,
  onDone,
}: {
  reducedMotion: boolean;
  onDone: (played: boolean) => void;
}) {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  const finishedRef = useRef(false);
  doneRef.current = onDone;

  useLayoutEffect(() => {
    if (
      reducedMotion ||
      window.sessionStorage.getItem("portfolio-intro-seen") === "true"
    ) {
      finishedRef.current = true;
      setDone(true);
      doneRef.current(false);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    document.body.classList.add("intro-locked");

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      window.sessionStorage.setItem("portfolio-intro-seen", "true");
      document.body.classList.remove("intro-locked");
      setDone(true);
      doneRef.current(true);
    };

    // Never trap the page behind the overlay if a tween fails to complete.
    const failsafe = window.setTimeout(finish, 6000);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          window.clearTimeout(failsafe);
          finish();
        },
      });

      tl.from(".intro-greeting", { opacity: 0, y: 14, duration: 0.5 })
        .from(".intro-name span", {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.06,
        }, "-=0.2")
        .fromTo(
          ".intro-rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, transformOrigin: "left center" },
          "-=0.35",
        )
        .from(".intro-role", { opacity: 0, y: 10, duration: 0.45 }, "-=0.3")
        .to({}, { duration: 0.35 })
        .to(".intro-inner", { opacity: 0, y: -18, duration: 0.4 })
        .to(root, { yPercent: -100, duration: 0.9, ease: "power3.inOut" });
    }, root);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      document.body.classList.remove("intro-locked");
    };
  }, [reducedMotion]);

  if (done) return null;

  return (
    <div className="intro" ref={rootRef} aria-hidden>
      <div className="intro-inner">
        <p className="intro-greeting">Welcome</p>
        <h2 className="intro-name">
          {hero.name.split(" ").map((word) => (
            <span key={word}>{word}</span>
          ))}
        </h2>
        <div className="intro-rule" />
        <p className="intro-role">Full Stack Developer · Hyderabad</p>
      </div>
    </div>
  );
}
