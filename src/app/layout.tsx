import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { contact, hero } from "@/data/portfolio";
import Providers from "@/components/Providers";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = "https://ravindra-mamillapalli.netlify.app";
const title = "Ravindra Mamillapalli · Full Stack Portfolio";
const description =
  "Portfolio of Ravindra Nadh Mamillapalli — full stack developer in Hyderabad building web apps, APIs, dashboards, and product systems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Ravindra Portfolio",
  authors: [{ name: hero.name, url: contact.linkedin }],
  creator: hero.name,
  keywords: [
    "Ravindra Mamillapalli",
    "Full Stack Developer",
    "Hyderabad",
    "React",
    "Angular",
    "Golang",
    "Node.js",
    "Java",
    "MySQL",
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Ravindra Mamillapalli",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  verification: {
    google: "ctUYLIeZ_2QwClU0bXJAaD6qDlOrmbXW46YXAmQ8i2A",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: hero.name,
  jobTitle: "Full Stack Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  email: `mailto:${contact.email}`,
  telephone: contact.phone,
  url: siteUrl,
  sameAs: [contact.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
