"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useId,
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

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <div className="scene-fallback" aria-hidden />,
});

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [openNote, setOpenNote] = useState<string | null>(notes[0].title);
  const [isPending, startTransition] = useTransition();
  const reducedMotion = usePrefersReducedMotion();
  const tablistId = useId();
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  const selectTab = (id: TabId) => {
    startTransition(() => setActiveTab(id));
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
      <div className="atmosphere" aria-hidden />
      <div className="scene-stage">
        <Scene3D activeTab={activeTab} reducedMotion={reducedMotion} />
      </div>

      <div className="shell">
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
              <p className="kicker">{hero.kicker}</p>
              <h1>{hero.name}</h1>
              <p className="lead">{hero.lead}</p>
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

          <div
            key={activeTab}
            className={`panel-stage${isPending ? " is-pending" : ""}`}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
          >
            {activeTab === "about" && (
              <div className="stack">
                <article className="panel">
                  <h2>{about.title}</h2>
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
              </div>
            )}

            {activeTab === "work" && (
              <div className="stack">
                <article className="panel">
                  <h2>Where the work happens</h2>
                  <p className="body-text">
                    Three years of product delivery in education and enterprise
                    systems — mostly owning features from ticket to release.
                  </p>
                </article>
                <div className="timeline">
                  {work.map((job) => (
                    <article key={job.role} className="panel job">
                      <div className="job-head">
                        <h3>{job.role}</h3>
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
                  <h2>Selected work</h2>
                  <p className="body-text">
                    Six systems across realtime processing, education platforms,
                    payments, maps, and internal tooling.
                  </p>
                </article>
                <div className="grid-2">
                  {projects.map((p) => (
                    <article key={p.title} className="panel project">
                      <div className="project-head">
                        <span className="tag">{p.tag}</span>
                        <span className="year">{p.year}</span>
                      </div>
                      <h3>{p.title}</h3>
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
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="stack">
                <article className="panel">
                  <h2>What I reach for</h2>
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

            {activeTab === "notes" && (
              <div className="stack">
                <article className="panel">
                  <h2>Notes from production work</h2>
                  <p className="body-text">
                    Short posts on what shipping actually taught me. Open one to
                    read the whole note.
                  </p>
                </article>
                <div className="note-list">
                  {notes.map((n) => {
                    const open = openNote === n.title;
                    return (
                      <article
                        key={n.title}
                        className={open ? "panel note is-open" : "panel note"}
                      >
                        <div className="note-meta">
                          <span>{n.date}</span>
                          <span>{n.topic}</span>
                          <span>{n.read}</span>
                        </div>
                        <h3>{n.title}</h3>
                        {open && <p className="body-text">{n.body}</p>}
                        <button
                          type="button"
                          className="note-toggle"
                          aria-expanded={open}
                          onClick={() => setOpenNote(open ? null : n.title)}
                        >
                          {open ? "Close note" : "Read note"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="stack">
                <article className="panel">
                  <h2>Education and certification</h2>
                  <p className="body-text">
                    Computer science degrees plus focused full-stack training
                    before moving into product work.
                  </p>
                </article>
                <div className="timeline">
                  {education.map((e) => (
                    <article key={e.title} className="panel job">
                      <div className="job-head">
                        <h3>{e.title}</h3>
                        <span>{e.when}</span>
                      </div>
                      <p className="company">{e.place}</p>
                      <p className="body-text">{e.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="stack">
                <article className="panel">
                  <h2>{contact.title}</h2>
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

        <footer className="footer">
          <span>© 2026 Ravindra Nadh Mamillapalli</span>
          <span>Built with Next.js and React Three Fiber</span>
        </footer>
      </div>
    </div>
  );
}
