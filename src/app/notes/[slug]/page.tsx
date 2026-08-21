import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { notes } from "@/data/portfolio";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);

  if (!note) return {};

  return {
    title: `${note.title} · Ravindra Mamillapalli`,
    description: note.body,
    openGraph: {
      type: "article",
      title: note.title,
      description: note.body,
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);

  if (!note) notFound();

  return (
    <main className="note-page">
      <article className="note-article">
        <Link href="/#about" className="note-back">
          ← Back to portfolio
        </Link>
        <div className="note-meta">
          <span>{note.date}</span>
          <span>{note.topic}</span>
          <span>{note.read}</span>
        </div>
        <h1>{note.title}</h1>
        <p>{note.body}</p>
      </article>
    </main>
  );
}
