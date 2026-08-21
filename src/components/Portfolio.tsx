"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import {
  about,
  concepts,
  contact,
  education,
  hero,
  notes,
  projects,
  skills,
  tabs,
  work,
  type TabId,
} from "@/data/portfolio";
import { DESKTOP_QUERY, MOBILE_QUERY, useGsapTab } from "@/lib/useGsapTab";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import TypeText from "@/components/TypeText";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <div className="scene-fallback" aria-hidden />,
});

const WelcomeIntro = dynamic(() => import("@/components/WelcomeIntro"), {
  ssr: false,
});

function isTabId(value: string): value is TabId {
  return tabs.some((tab) => tab.id === value);
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [introDone, setIntroDone] = useState(false);
  const [playEntrance, setPlayEntrance] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isPending, startTransition] = useTransition();
  const reducedMotion = usePrefersReducedMotion();
  const panelRef = useGsapTab(activeTab, reducedMotion, introDone);
  const shellRef = useRef<HTMLDivElement>(null);
  const tablistId = useId();
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const featuredNote = notes[0];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const update = () => setShowCanvas(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Park the shell out of position while the intro still covers the page, so
  // the reveal never shows the settled layout first.
  useLayoutEffect(() => {
    if (introDone || reducedMotion || !playEntrance) return;
    const shell = shellRef.current;
    if (!shell) return;

    const rail = shell.querySelector(".rail");
    const wrap = shell.querySelector(".panel-wrap");
    const topbar = shell.querySelector(".topbar");
    const sideways = window.matchMedia(DESKTOP_QUERY).matches;

    gsap.set(rail, sideways ? { x: -220, opacity: 0 } : { y: 44, opacity: 0 });
    gsap.set(wrap, sideways ? { x: 220, opacity: 0 } : { y: 72, opacity: 0 });
    gsap.set(topbar, { y: -24, opacity: 0 });

    return () => {
      gsap.set([rail, wrap, topbar], { clearProps: "all" });
    };
  }, [introDone, reducedMotion, playEntrance]);

  useLayoutEffect(() => {
    if (!introDone || reducedMotion || !playEntrance) return;
    const shell = shellRef.current;
    if (!shell) return;

    const mm = gsap.matchMedia();

    mm.add(DESKTOP_QUERY, () => {
      const tl = gsap.timeline({
        delay: 0.25,
        defaults: { duration: 1.8, ease: "power2.out" },
      });
      tl.fromTo(".rail", { x: -220, opacity: 0 }, { x: 0, opacity: 1 }, 0)
        .fromTo(".panel-wrap", { x: 220, opacity: 0 }, { x: 0, opacity: 1 }, 0)
        .fromTo(
          ".topbar",
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1 },
          0.3,
        );
    }, shell);

    // The rail and panel stack vertically on a phone, so the entrance rises
    // instead of sliding in from the sides.
    mm.add(MOBILE_QUERY, () => {
      const tl = gsap.timeline({
        delay: 0.12,
        defaults: { duration: 0.8, ease: "power3.out" },
      });
      tl.fromTo(".topbar", { y: -24, opacity: 0 }, { y: 0, opacity: 1 }, 0)
        .fromTo(
          ".rail",
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, clearProps: "transform" },
          0.1,
        )
        .fromTo(
          ".hero > *",
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          0.2,
        )
        .fromTo(
          ".tab",
          { y: 16, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05 },
          0.45,
        )
        .fromTo(
          ".panel-wrap",
          { y: 72, opacity: 0 },
          { y: 0, opacity: 1, clearProps: "transform" },
          0.5,
        );
    }, shell);

    return () => mm.revert();
  }, [introDone, reducedMotion, playEntrance]);

  // Keep the active pill visible in the scrolling mobile tab strip.
  useEffect(() => {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    const button = document.getElementById(`tab-${activeTab}`);
    button?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab, reducedMotion]);

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace("#", "");
      if (isTabId(id)) setActiveTab(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectTab = (id: TabId) => {
    startTransition(() => setActiveTab(id));
    window.history.replaceState(null, "", `#${id}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === activeTab);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectTab(tabs[(index + 1) % tabs.length].id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectTab(tabs[(index - 1 + tabs.length) % tabs.length].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectTab(tabs[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      selectTab(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div
      className="portfolio"
      style={{ ["--tab-accent" as string]: current.accent }}
    >
      <WelcomeIntro
        reducedMotion={reducedMotion}
        onDone={(played) => {
          setPlayEntrance(played);
          setIntroDone(true);
        }}
      />
      <div className="atmosphere" aria-hidden />
      {showCanvas && (
        <div
          className={
            activeTab === "projects" ? "scene-stage is-projects" : "scene-stage"
          }
        >
          <Scene3D activeTab={activeTab} reducedMotion={reducedMotion} />
        </div>
      )}

      <div className="shell" ref={shellRef}>
        <header className="topbar">
          <p className="brand">Ravindra Mamillapalli</p>
          <nav className="topbar-links">
            <a href={`mailto:${contact.email}`}>Email</a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </nav>
        </header>

        <div className="layout">
          <aside className="rail">
            <section className="hero">
              <p className="kicker">
                <TypeText text={hero.kicker} start={introDone} cps={90} />
              </p>
              <h1>
                <TypeText
                  text={hero.name}
                  start={introDone}
                  cps={26}
                  delay={0.35}
                />
              </h1>
              <p className="lead">
                {hero.lead}
              </p>
              <dl className="stats">
                {hero.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.value}</dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div
              className="tabs"
              role="tablist"
              aria-label="Portfolio sections"
              id={tablistId}
              onKeyDown={onKeyDown}
            >
              {tabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    className={selected ? "tab is-active" : "tab"}
                    onClick={() => selectTab(tab.id)}
                  >
                    <span className="tab-dot" style={{ background: tab.accent }} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <p className="tab-caption">{current.caption}</p>
          </aside>

          <div className="panel-wrap">
          <div
            key={activeTab}
            ref={panelRef}
            className={`panel-stage${isPending ? " is-pending" : ""}`}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
          >
            {activeTab === "about" && (
              <div className="stack">
                <article className="panel">
                  <h2>
                    <TypeText text={about.title} />
                  </h2>
                  {about.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="body-text">
                      {p}
                    </p>
                  ))}
                </article>

                <div className="grid-2">
                  <article className="panel">
                    <h3 className="panel-title">Quick facts</h3>
                    <dl className="facts">
                      {about.facts.map((f) => (
                        <div key={f.label}>
                          <dt>{f.label}</dt>
                          <dd>{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>

                  <article className="panel">
                    <h3 className="panel-title">How I work</h3>
                    <div className="principle-list">
                      {about.principles.map((p) => (
                        <div key={p.title} className="principle">
                          <strong>{p.title}</strong>
                          <span>{p.body}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <article className="panel">
                  <h3 className="panel-title">Education & certification</h3>
                  <div className="education-list">
                    {education.map((item) => (
                      <div key={item.title} className="education-item">
                        <div className="job-head">
                          <h4>{item.title}</h4>
                          <span>{item.when}</span>
                        </div>
                        <p className="company">{item.place}</p>
                        <p className="body-text">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel featured-note">
                  <div className="note-meta">
                    <span>Featured note</span>
                    <span>{featuredNote.date}</span>
                    <span>{featuredNote.read}</span>
                  </div>
                  <h3>{featuredNote.title}</h3>
                  <p className="body-text">{featuredNote.body}</p>
                  <Link href={`/notes/${featuredNote.slug}`} className="text-link">
                    Read the full note
                  </Link>
                </article>
              </div>
            )}

            {activeTab === "work" && (
              <div className="stack">
                <article className="panel">
                  <h2>
                    <TypeText text="Where the work happens" />
                  </h2>
                  <p className="body-text">
                    Three years of product delivery in education and enterprise
                    systems — mostly owning features from ticket to release.
                  </p>
                </article>
                <div className="timeline">
                  {work.map((job) => (
                    <article key={job.role} className="panel job">
                      <div className="job-head">
                        <h3>
                          <TypeText text={job.role} cps={30} />
                        </h3>
                        <span>{job.when}</span>
                      </div>
                      <p className="company">
                        {job.company} · {job.location}
                      </p>
                      <p className="body-text">{job.summary}</p>
                      <ul className="bullets">
                        {job.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <ul className="tech">
                        {job.stack.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="stack">
                <article className="panel">
                  <h2>
                    <TypeText text="Selected work" />
                  </h2>
                  <p className="body-text">
                    Six systems across realtime processing, education platforms,
                    payments, maps, and internal tooling.
                  </p>
                </article>
                <div className="project-zigzag">
                  {projects.map((p, i) => (
                    <article
                      key={p.title}
                      className={
                        i % 2 === 1
                          ? "panel project is-right"
                          : "panel project is-left"
                      }
                    >
                      <div className="project-head">
                        <span className="tag">{p.tag}</span>
                        <span className="year">{p.year}</span>
                      </div>
                      <h3>
                        <TypeText text={p.title} cps={30} />
                      </h3>
                      <p className="role-line">{p.role}</p>
                      <p className="body-text">{p.blurb}</p>
                      <ul className="bullets tight">
                        {p.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                      <ul className="tech">
                        {p.tech.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <div className="project-actions">
                        <span className="project-access">{p.access}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="stack">
                <article className="panel">
                  <h2>
                    <TypeText text="What I reach for" />
                  </h2>
                  <div className="skill-list">
                    {skills.map((s) => (
                      <div key={s.group} className="skill-row">
                        <div className="skill-head">
                          <strong>{s.group}</strong>
                          <span className="level">{s.level}</span>
                        </div>
                        <ul className="tech">
                          {s.items.map((i) => (
                            <li key={i}>{i}</li>
                          ))}
                        </ul>
                        <p className="skill-note">{s.note}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <h3 className="panel-title">Core concepts by language</h3>
                  <div className="concept-stack">
                    {concepts.map((c) => (
                      <div key={c.language} className="concept-card">
                        <div className="concept-top">
                          <h4>{c.language}</h4>
                          <span>{c.badge}</span>
                        </div>
                        <div className="concept-grid">
                          {c.items.map((item) => (
                            <div key={item.title} className="concept-item">
                              <strong>{item.title}</strong>
                              <span>{item.body}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="stack">
                <article className="panel">
                  <h2>
                    <TypeText text={contact.title} />
                  </h2>
                  <p className="body-text">{contact.lead}</p>
                  <div className="contact-links">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                      {contact.phone}
                    </a>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </div>
                </article>
                <article className="panel">
                  <h3 className="panel-title">Details</h3>
                  <dl className="facts">
                    <div>
                      <dt>Location</dt>
                      <dd>{contact.location}</dd>
                    </div>
                    <div>
                      <dt>Availability</dt>
                      <dd>{contact.availability}</dd>
                    </div>
                    <div>
                      <dt>Response time</dt>
                      <dd>{contact.responseTime}</dd>
                    </div>
                  </dl>
                </article>
              </div>
            )}
          </div>
          </div>
        </div>

        <footer className="footer">
          <span>© 2026 Ravindra Nadh Mamillapalli</span>
          <span>Built with Next.js and React Three Fiber</span>
        </footer>
      </div>
    </div>
  );
}
